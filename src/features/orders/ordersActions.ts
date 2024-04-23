import { Registry, Server, SwapERC20 } from "@airswap/libraries";
import {
  FullOrderERC20,
  OrderERC20,
  ProtocolIds,
  toAtomicString,
  TokenInfo,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { Web3Provider, TransactionReceipt } from "@ethersproject/providers";
import { Dispatch } from "@reduxjs/toolkit";

import { AppDispatch } from "../../app/store";
import {
  notifyApproval,
  notifyConfirmation,
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
import { transformUnsignedOrderERC20ToOrderERC20 } from "../../entities/OrderERC20/OrderERC20Transformers";
import {
  SubmittedApprovalTransaction,
  SubmittedCancellation,
  SubmittedDepositTransaction,
  SubmittedOrder,
  SubmittedWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  transformToSubmittedApprovalTransaction,
  transformToSubmittedDepositTransaction,
  transformToSubmittedTransactionWithOrder,
  transformToSubmittedTransactionWithOrderUnderConsideration,
  transformToSubmittedWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransactionTransformers";
import { AppErrorType, isAppError } from "../../errors/appError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";
import { createOrderERC20Signature } from "../../helpers/createSwapSignature";
import getWethAddress from "../../helpers/getWethAddress";
import toRoundedAtomicString from "../../helpers/toRoundedAtomicString";
import i18n from "../../i18n/i18n";
import { TransactionStatusType } from "../../types/transactionTypes";
import {
  declineTransaction,
  revertTransaction,
  submitTransaction,
} from "../transactions/transactionsActions";
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

export const handleApproveTransaction = (
  transaction: SubmittedApprovalTransaction,
  status: TransactionStatusType
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.approvalFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }

  notifyApproval(transaction);
};

export const handleSubmittedDepositOrder = (
  transaction: SubmittedDepositTransaction,
  status: TransactionStatusType
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.swapFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }

  notifyDeposit(transaction);
};

export const handleSubmittedWithdrawOrder = (
  transaction: SubmittedWithdrawTransaction,
  status: TransactionStatusType
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.swapFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }

  notifyWithdrawal(transaction);
};

export const handleSubmittedOrder = (
  transaction: SubmittedOrder,
  status: TransactionStatusType
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.swapFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }

  notifyOrder(transaction);
};

export const handleSubmittedCancelOrder = (
  status: TransactionStatusType
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.cancelFailed"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }

  notifyConfirmation({ heading: i18n.t("toast.cancelComplete"), cta: "" });
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
    dispatch(setErrors([appError]));
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

// interface RequestParams {
//   servers: Server[];
//   signerToken: string;
//   senderToken: string;
//   senderAmount: string;
//   senderTokenDecimals: number;
//   senderWallet: string;
//   proxyingFor?: string;
// }

// export const request =
//   (params: RequestParams) =>
//   async (dispatch: AppDispatch): Promise<OrderERC20[]> => {
//     dispatch(setStatus("requesting"));
//
//     try {
//       const orders = await requestOrders(
//         params.servers,
//         params.signerToken,
//         params.senderToken,
//         params.senderAmount,
//         params.senderTokenDecimals,
//         params.senderWallet,
//         params.proxyingFor
//       );
//
//       const bestOrder = [...orders].sort(orderSortingFunction)[0];
//       const now = Date.now();
//       const expiry = parseInt(bestOrder.expiry) * 1000;
//       // Due to the sorting in orderSorting function, these orders will be at
//       // the bottom of the list, so if the best one has a very short expiry
//       // so do all the others. Return an empty order array as none are viable.
//       if (expiry - now < RFQ_EXPIRY_BUFFER_MS) {
//         dispatch(setStatus("idle"));
//         dispatch(setOrders([]));
//
//         return [];
//       }
//
//       const timeTilReRequest = Math.max(
//         expiry - now - RFQ_EXPIRY_BUFFER_MS,
//         RFQ_MINIMUM_REREQUEST_DELAY_MS
//       );
//       const reRequestTimerId = window.setTimeout(
//         () => dispatch(request(params)),
//         timeTilReRequest
//       );
//
//       dispatch(setReRequestTimerId(reRequestTimerId));
//       dispatch(setOrders(orders));
//       dispatch(setStatus("idle"));
//
//       return orders;
//     } catch {
//       dispatch(setOrders([]));
//       dispatch(setStatus("failed"));
//
//       return [];
//     }
//   };

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
    signerToken: TokenInfo,
    senderToken: TokenInfo,
    library: Web3Provider,
    contractType: "Swap" | "Wrapper"
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

    const transaction = transformToSubmittedTransactionWithOrder(
      tx.hash,
      updatedOrder,
      signerToken,
      senderToken
    );

    dispatch(submitTransaction(transaction));
    dispatch(setStatus("idle"));
  };

export const takeLastLookOrder =
  (
    chainId: number,
    library: Web3Provider,
    locator: string,
    signerToken: TokenInfo,
    senderToken: TokenInfo,
    unsignedOrder: UnsignedOrderERC20
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const servers = await Registry.getServers(
      library,
      chainId,
      ProtocolIds.LastLookERC20,
      signerToken.address,
      senderToken.address
    );

    console.log(servers);
    const server = servers.find((server) => server.locator === locator);

    if (!server) {
      console.error("[takeLastLookOrder] Server not found");

      return;
    }

    dispatch(setStatus("signing"));

    const signature = await createOrderERC20Signature(
      unsignedOrder,
      library.getSigner(),
      SwapERC20.getAddress(chainId)!,
      chainId
    );

    if (isAppError(signature)) {
      if (signature.type === AppErrorType.rejectedByUser) {
        notifyRejectedByUserError();
      }
      dispatch(setStatus("failed"));

      return;
    }

    const order = transformUnsignedOrderERC20ToOrderERC20(
      unsignedOrder,
      signature
    );
    console.log(order);

    try {
      await server.considerOrderERC20(order);
    } catch (e) {
      console.error("[takeLastLookOrder] Error considering order", e);
    }

    const transaction =
      transformToSubmittedTransactionWithOrderUnderConsideration(
        order,
        signerToken,
        senderToken
      );
    console.log(transaction);

    dispatch(submitTransaction(transaction));

    dispatch(setStatus("idle"));
  };
