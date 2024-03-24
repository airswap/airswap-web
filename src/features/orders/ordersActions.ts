import { Server } from "@airswap/libraries";
import {
  FullOrderERC20,
  OrderERC20,
  toAtomicString,
  TokenInfo,
} from "@airswap/utils";
import { TransactionReceipt } from "@ethersproject/providers";
import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";

import { providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import {
  notifyApproval,
  notifyDeposit,
  notifyError,
  notifyOrder,
  notifyRejectedByUserError,
  notifyWithdrawal,
} from "../../components/Toasts/ToastController";
import {
  RFQ_EXPIRY_BUFFER_MS,
  RFQ_MINIMUM_REREQUEST_DELAY_MS,
} from "../../constants/configParams";
import nativeCurrency from "../../constants/nativeCurrency";
import {
  SubmittedApprovalTransaction,
  SubmittedDepositTransaction,
  SubmittedTransactionWithOrder,
  SubmittedWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  transformToSubmittedApprovalTransaction,
  transformToSubmittedDepositTransaction,
  transformToSubmittedRFQOrder,
  transformToSubmittedWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransactionTransformers";
import { AppErrorType, isAppError } from "../../errors/appError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";
import getWethAddress from "../../helpers/getWethAddress";
import toRoundedAtomicString from "../../helpers/toRoundedAtomicString";
import i18n from "../../i18n/i18n";
import {
  allowancesSwapActions,
  decrementBalanceBy,
  incrementBalanceBy,
} from "../balances/balancesSlice";
import {
  declineTransaction,
  mineTransaction,
  revertTransaction,
  submitTransaction,
} from "../transactions/transactionsActions";
import { submitTransactionWithExpiry } from "../transactions/transactionsSlice";
import {
  approveToken,
  depositETH,
  orderSortingFunction,
  requestOrders,
  takeOrder,
  withdrawETH,
} from "./ordersApi";

// import {
//   clear,
//   setErrors,
//   setReRequestTimerId,
//   setResetStatus,
// } from "./ordersSlice";

const failTransaction = (
  hash: string,
  heading: string,
  dispatch: AppDispatch
): void => {
  dispatch(revertTransaction({ hash }));

  notifyError({
    heading,
    cta: i18n.t("validatorErrors.unknownError"),
  });
};

export const handleApproveTransaction = (
  transaction: SubmittedApprovalTransaction,
  receipt: TransactionReceipt,
  dispatch: AppDispatch
): void => {
  if (receipt.status !== 1) {
    failTransaction(
      receipt.transactionHash,
      i18n.t("toast.approvalFail"),
      dispatch
    );

    return;
  }

  const amount = toRoundedAtomicString(
    transaction.amount,
    transaction.token.decimals
  );

  dispatch(mineTransaction({ hash: transaction.hash }));
  dispatch(
    allowancesSwapActions.set({
      tokenAddress: transaction.tokenAddress,
      amount: amount,
    })
  );

  notifyApproval(transaction);
};

export const handleSubmittedDepositOrder = (
  transaction: SubmittedDepositTransaction,
  receipt: TransactionReceipt,
  dispatch: AppDispatch
): void => {
  if (receipt.status !== 1) {
    failTransaction(
      receipt.transactionHash,
      i18n.t("toast.swapFail"),
      dispatch
    );

    return;
  }

  const amount = toRoundedAtomicString(
    transaction.order.senderAmount,
    transaction.order.senderToken.decimals
  );

  dispatch(mineTransaction({ hash: transaction.hash }));
  dispatch(
    incrementBalanceBy({
      tokenAddress: transaction.order.senderToken.address,
      amount: amount,
    })
  );

  notifyDeposit(transaction);
};

export const handleSubmittedWithdrawOrder = (
  transaction: SubmittedWithdrawTransaction,
  receipt: TransactionReceipt,
  dispatch: AppDispatch
): void => {
  if (receipt.status !== 1) {
    failTransaction(
      receipt.transactionHash,
      i18n.t("toast.swapFail"),
      dispatch
    );

    return;
  }

  const amount = toRoundedAtomicString(
    transaction.order.senderAmount,
    transaction.order.senderToken.decimals
  );

  dispatch(mineTransaction({ hash: transaction.hash }));
  dispatch(
    decrementBalanceBy({
      tokenAddress: transaction.order.senderToken.address,
      amount: amount,
    })
  );

  notifyWithdrawal(transaction);
};

export const handleSubmittedRFQOrder = (
  transaction: SubmittedTransactionWithOrder,
  receipt: TransactionReceipt,
  dispatch: AppDispatch
): void => {
  if (receipt.status !== 1) {
    failTransaction(
      receipt.transactionHash,
      i18n.t("toast.swapFail"),
      dispatch
    );

    return;
  }

  notifyOrder(transaction);
};

// replaces WETH to ETH on Wrapper orders
const refactorOrder = (order: OrderERC20, chainId: number) => {
  let newOrder = { ...order };
  if (order.senderToken === getWethAddress(chainId)) {
    newOrder.senderToken = nativeCurrency[chainId].address;
  } else if (order.signerToken === getWethAddress(chainId)) {
    newOrder.signerToken = nativeCurrency[chainId].address;
  }
  return newOrder;
};

export const handleOrderError = (dispatch: Dispatch, error: any) => {
  const appError = transformUnknownErrorToAppError(error);

  if (appError.error && "message" in appError.error) {
    dispatch(declineTransaction(appError.error.message));
  }

  if (appError.type === AppErrorType.rejectedByUser) {
    notifyRejectedByUserError();
  } else {
    // dispatch(setErrors([appError]));
  }
};

export const deposit = createAsyncThunk(
  "orders/deposit",
  async (
    params: {
      chainId: number;
      senderAmount: string;
      senderToken: TokenInfo;
      provider: providers.Web3Provider;
    },
    { dispatch }
  ) => {
    try {
      const tx = await depositETH(
        params.chainId,
        params.senderAmount,
        params.senderToken.decimals,
        params.provider
      );

      if (!tx.hash) {
        console.error("Approval transaction hash is missing.");

        return;
      }

      const amount = toAtomicString(
        params.senderAmount,
        params.senderToken.decimals
      );

      const transaction = transformToSubmittedDepositTransaction(
        tx.hash,
        params.senderToken,
        nativeCurrency[params.chainId],
        amount
      );

      dispatch(submitTransaction(transaction));
    } catch (e: any) {
      handleOrderError(dispatch, e);
      throw e;
    }
  }
);

export const resetOrders = createAsyncThunk(
  "orders/reset",
  async (params: undefined, { getState, dispatch }) => {
    // await dispatch(setResetStatus());
    // dispatch(clear());
  }
);

export const withdraw = createAsyncThunk(
  "orders/withdraw",
  async (
    params: {
      chainId: number;
      senderAmount: string;
      senderToken: TokenInfo;
      provider: any;
    },
    { getState, dispatch }
  ) => {
    try {
      const tx = await withdrawETH(
        params.chainId,
        params.senderAmount,
        params.senderToken.decimals,
        params.provider
      );

      if (!tx.hash) {
        console.error("Approval transaction hash is missing.");

        return;
      }

      const amount = toAtomicString(
        params.senderAmount,
        params.senderToken.decimals
      );

      const transaction = transformToSubmittedWithdrawTransaction(
        tx.hash,
        nativeCurrency[params.chainId],
        params.senderToken,
        amount
      );

      dispatch(submitTransaction(transaction));
    } catch (e: any) {
      handleOrderError(dispatch, e);
      throw e;
    }
  }
);

export const request = createAsyncThunk(
  "orders/request",
  async (
    params: {
      servers: Server[];
      signerToken: string;
      senderToken: string;
      senderAmount: string;
      senderTokenDecimals: number;
      senderWallet: string;
      proxyingFor?: string;
    },
    { dispatch }
  ) => {
    const orders = await requestOrders(
      params.servers,
      params.signerToken,
      params.senderToken,
      params.senderAmount,
      params.senderTokenDecimals,
      params.senderWallet,
      params.proxyingFor
    );
    if (orders.length) {
      const bestOrder = [...orders].sort(orderSortingFunction)[0];
      const now = Date.now();
      const expiry = parseInt(bestOrder.expiry) * 1000;
      // Due to the sorting in orderSorting function, these orders will be at
      // the bottom of the list, so if the best one has a very short expiry
      // so do all the others. Return an empty order array as none are viable.
      if (expiry - now < RFQ_EXPIRY_BUFFER_MS) return [];

      const timeTilReRequest = Math.max(
        expiry - now - RFQ_EXPIRY_BUFFER_MS,
        RFQ_MINIMUM_REREQUEST_DELAY_MS
      );
      const reRequestTimerId = window.setTimeout(
        () => dispatch(request(params)),
        timeTilReRequest
      );
      // dispatch(setReRequestTimerId(reRequestTimerId));
    }
    return orders;
  }
);

export const approve = createAsyncThunk<
  // Return type of the payload creator
  void,
  // Params
  {
    token: TokenInfo;
    library: any;
    contractType: "Wrapper" | "Swap";
    chainId: number;
    amount: string;
  },
  // Types for ThunkAPI
  {
    // thunkApi
    dispatch: AppDispatch;
    state: RootState;
  }
>("orders/approve", async (params, { getState, dispatch }) => {
  try {
    const { token, contractType, amount } = params;
    const approveAmount = toRoundedAtomicString(amount, token.decimals);

    const tx = await approveToken(
      token.address,
      params.library,
      contractType,
      approveAmount
    );

    if (!tx.hash) {
      console.error("Approval transaction hash is missing.");

      return;
    }

    const transaction = transformToSubmittedApprovalTransaction(
      tx.hash,
      token,
      approveAmount
    );
    dispatch(submitTransaction(transaction));
  } catch (e: any) {
    handleOrderError(dispatch, e);
    throw e;
  }
});

export const take = createAsyncThunk<
  void,
  {
    order: OrderERC20 | FullOrderERC20;
    senderToken: TokenInfo;
    signerToken: TokenInfo;
    library: any;
    contractType: "Swap" | "Wrapper";
    onExpired: () => void;
  },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  "orders/take",
  async (
    { order, senderToken, signerToken, library, contractType, onExpired },
    { dispatch }
  ) => {
    const tx = await takeOrder(order, library, contractType);

    if (isAppError(tx)) {
      const appError = tx;
      if (appError.type === AppErrorType.rejectedByUser) {
        notifyRejectedByUserError();
        dispatch(
          revertTransaction({
            signerWallet: order.signerWallet,
            nonce: order.nonce,
            reason: appError.type,
          })
        );
      } else {
        // dispatch(setErrors([appError]));
      }

      if (appError.error && "message" in appError.error) {
        // dispatch(declineTransaction(appError.error.message));
      }

      throw appError;
    }

    if (!tx.hash) {
      console.error("Approval transaction hash is missing.");

      return;
    }

    // When dealing with the Wrapper, since the "actual" swap is ETH <-> ERC20,
    // we should change the order tokens to WETH -> ETH
    const updatedOrder =
      contractType === "Swap"
        ? order
        : refactorOrder(order, library._network.chainId);

    const transaction = transformToSubmittedRFQOrder(
      tx.hash,
      updatedOrder,
      signerToken,
      senderToken
    );

    dispatch(
      submitTransactionWithExpiry({
        transaction,
        signerWallet: order.signerWallet,
        onExpired: onExpired,
      })
    );
  }
);
