import { Server } from "@airswap/libraries";
import {
  FullOrderERC20,
  OrderERC20,
  toAtomicString,
  TokenInfo,
} from "@airswap/utils";
import { Web3Provider, TransactionReceipt } from "@ethersproject/providers";
import { Dispatch } from "@reduxjs/toolkit";

import { AppDispatch } from "../../app/store";
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
} from "./ordersHelpers";
import {
  setErrors,
  setOrders,
  setReRequestTimerId,
  setStatus,
} from "./ordersSlice";

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

  dispatch(mineTransaction({ hash: transaction.hash }));

  // TODO: Balance handling should be done in balancesApi.ts https://github.com/airswap/airswap-web/issues/889

  dispatch(
    incrementBalanceBy({
      tokenAddress: transaction.signerToken.address,
      amount: transaction.order.signerAmount,
    })
  );

  dispatch(
    decrementBalanceBy({
      tokenAddress: transaction.senderToken.address,
      amount: transaction.order.senderAmount,
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

  dispatch(mineTransaction({ hash: transaction.hash }));

  // TODO: Balance handling should be done in balancesApi.ts https://github.com/airswap/airswap-web/issues/889

  dispatch(
    incrementBalanceBy({
      tokenAddress: transaction.signerToken.address,
      amount: transaction.order.signerAmount,
    })
  );

  dispatch(
    decrementBalanceBy({
      tokenAddress: transaction.senderToken.address,
      amount: transaction.order.senderAmount,
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

export const deposit =
  (
    amount: string,
    nativeToken: TokenInfo,
    wrappedNativeToken: TokenInfo,
    chainId: number,
    provider: Web3Provider
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setStatus("signing"));

    try {
      const tx = await depositETH(
        chainId,
        amount,
        nativeToken.decimals,
        provider
      );

      if (!tx.hash) {
        console.error("Deposit transaction hash is missing.");

        dispatch(setStatus("failed"));

        return;
      }

      const transaction = transformToSubmittedDepositTransaction(
        tx.hash,
        nativeToken,
        wrappedNativeToken,
        toAtomicString(amount, nativeToken.decimals)
      );

      dispatch(setStatus("idle"));
      dispatch(submitTransaction(transaction));
    } catch (e: any) {
      dispatch(setStatus("failed"));
      handleOrderError(dispatch, e);
    }
  };

export const withdraw =
  (
    amount: string,
    nativeToken: TokenInfo,
    wrappedNativeToken: TokenInfo,
    chainId: number,
    provider: Web3Provider
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    console.log(nativeToken, wrappedNativeToken);
    dispatch(setStatus("signing"));

    try {
      const tx = await withdrawETH(
        chainId,
        amount,
        wrappedNativeToken.decimals,
        provider
      );

      if (!tx.hash) {
        console.error("Withdraw transaction hash is missing.");

        dispatch(setStatus("failed"));

        return;
      }

      const transaction = transformToSubmittedWithdrawTransaction(
        tx.hash,
        nativeToken,
        wrappedNativeToken,
        toAtomicString(amount, wrappedNativeToken.decimals)
      );

      dispatch(setStatus("idle"));
      dispatch(submitTransaction(transaction));
    } catch (e: any) {
      dispatch(setStatus("failed"));
      handleOrderError(dispatch, e);
    }
  };

interface RequestParams {
  servers: Server[];
  signerToken: string;
  senderToken: string;
  senderAmount: string;
  senderTokenDecimals: number;
  senderWallet: string;
  proxyingFor?: string;
}

export const request =
  (params: RequestParams) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setStatus("requesting"));

    try {
      const orders = await requestOrders(
        params.servers,
        params.signerToken,
        params.senderToken,
        params.senderAmount,
        params.senderTokenDecimals,
        params.senderWallet,
        params.proxyingFor
      );

      const bestOrder = [...orders].sort(orderSortingFunction)[0];
      const now = Date.now();
      const expiry = parseInt(bestOrder.expiry) * 1000;
      // Due to the sorting in orderSorting function, these orders will be at
      // the bottom of the list, so if the best one has a very short expiry
      // so do all the others. Return an empty order array as none are viable.
      if (expiry - now < RFQ_EXPIRY_BUFFER_MS) {
        dispatch(setStatus("idle"));
        dispatch(setOrders([]));

        return;
      }

      const timeTilReRequest = Math.max(
        expiry - now - RFQ_EXPIRY_BUFFER_MS,
        RFQ_MINIMUM_REREQUEST_DELAY_MS
      );
      const reRequestTimerId = window.setTimeout(
        () => dispatch(request(params)),
        timeTilReRequest
      );

      console.log(orders);

      dispatch(setReRequestTimerId(reRequestTimerId));
      dispatch(setOrders(orders));
      dispatch(setStatus("idle"));
    } catch {
      dispatch(setOrders([]));
      dispatch(setStatus("failed"));
    }
  };

export const approve =
  (
    amount: string,
    token: TokenInfo,
    library: Web3Provider,
    contractType: "Wrapper" | "Swap"
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setStatus("signing"));

    try {
      const approveAmount = toRoundedAtomicString(amount, token.decimals);

      const tx = await approveToken(
        token.address,
        library,
        contractType,
        approveAmount
      );

      if (!tx.hash) {
        console.error("Approval transaction hash is missing.");

        dispatch(setStatus("failed"));

        return;
      }

      const transaction = transformToSubmittedApprovalTransaction(
        tx.hash,
        token,
        approveAmount
      );

      dispatch(submitTransaction(transaction));
      dispatch(setStatus("idle"));
    } catch (e: any) {
      dispatch(setStatus("failed"));
      handleOrderError(dispatch, e);
    }
  };

export const take =
  (
    order: OrderERC20 | FullOrderERC20,
    senderToken: TokenInfo,
    signerToken: TokenInfo,
    library: Web3Provider,
    contractType: "Swap" | "Wrapper",
    onExpired?: () => void
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setStatus("signing"));

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
        dispatch(setErrors([appError]));
      }

      if (appError.error && "message" in appError.error) {
        dispatch(declineTransaction(appError.error.message));
      }

      dispatch(setStatus("failed"));

      return;
    }

    if (!tx.hash) {
      console.error("Approval transaction hash is missing.");

      dispatch(setStatus("failed"));

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
        onExpired,
      })
    );
    dispatch(setStatus("idle"));
  };
