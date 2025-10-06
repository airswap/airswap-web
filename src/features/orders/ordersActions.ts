import { Registry, Swap } from "@airswap/libraries";
import {
  FullOrder,
  FullOrderERC20,
  OrderERC20,
  ProtocolIds,
  toAtomicString,
  TokenInfo,
  TokenKinds,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../app/store";
import {
  notifyError,
  notifyRejectedByUserError,
} from "../../components/Toasts/ToastController";
import nativeCurrency from "../../constants/nativeCurrency";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenKind,
  isCollectionTokenInfo,
  isTokenInfo,
} from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { takeFullOrder as takeFullOrderHelper } from "../../entities/FullOrder/FullOrderHelpers";
import { transformUnsignedOrderERC20ToOrderERC20 } from "../../entities/OrderERC20/OrderERC20Transformers";
import {
  SubmittedDepositTransaction,
  SubmittedOrder,
  SubmittedOrderUnderConsideration,
  SubmittedSetRuleTransaction,
  SubmittedUnsetRuleTransaction,
  SubmittedWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  transformToSubmittedApprovalTransaction,
  transformToSubmittedDepositTransaction,
  transformToSubmittedTransactionWithOrder,
  transformToSubmittedTransactionWithOrderUnderConsideration,
  transformToSubmittedWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransactionTransformers";
import { AppError, AppErrorType, isAppError } from "../../errors/appError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";
import { createOrderERC20Signature } from "../../helpers/createSwapSignature";
import getWethAddress from "../../helpers/getWethAddress";
import { getSwapErc20Address } from "../../helpers/swapErc20";
import toRoundedAtomicString from "../../helpers/toRoundedAtomicString";
import i18n from "../../i18n/i18n";
import { TransactionStatusType } from "../../types/transactionTypes";
import {
  submitDelegateRuleToStore,
  unsetDelegateRuleFromStore,
} from "../delegateRules/delegateRulesActions";
import {
  declineTransaction,
  revertTransaction,
  submitTransaction,
} from "../transactions/transactionsActions";
import {
  approveErc20Token,
  approveNftToken,
  depositETH,
  takeErc20Order,
  withdrawETH,
} from "./ordersHelpers";
import { setErrors, setStatus } from "./ordersSlice";

export const handleApproveTransaction = (
  status: TransactionStatusType
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.approvalFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }
};

export const handleSubmittedDepositOrder = (
  status: TransactionStatusType
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.swapFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }
};

export const handleSubmittedWithdrawOrder = (
  status: TransactionStatusType
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.swapFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }
};

export const handleSubmittedOrder = (status: TransactionStatusType): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.swapFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }
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
};

export const handleSubmittedSetRuleOrder = (
  transaction: SubmittedSetRuleTransaction,
  dispatch: AppDispatch
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.orderFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });

    return;
  }

  dispatch(submitDelegateRuleToStore(transaction.rule));
};

export const handleSubmittedUnsetRuleOrder = (
  transaction: SubmittedUnsetRuleTransaction,
  dispatch: AppDispatch
): void => {
  if (status === TransactionStatusType.failed) {
    notifyError({
      heading: i18n.t("toast.orderFail"),
      cta: i18n.t("validatorErrors.unknownError"),
    });
  }

  dispatch(
    unsetDelegateRuleFromStore({
      chainId: transaction.chainId,
      senderWallet: transaction.senderWallet,
      senderToken: transaction.senderToken.address,
      signerToken: transaction.signerToken.address,
    })
  );
};

// replaces WETH to ETH on Wrapper orders
const refactorOrder = (order: OrderERC20, chainId: number) => {
  const newOrder = { ...order };
  if (order.senderToken === getWethAddress(chainId)) {
    newOrder.senderToken = nativeCurrency[chainId].address!;
  } else if (order.signerToken === getWethAddress(chainId)) {
    newOrder.signerToken = nativeCurrency[chainId].address!;
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
  async (
    dispatch: AppDispatch
  ): Promise<SubmittedDepositTransaction | undefined> => {
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

      return transaction;
    } catch (e: any) {
      dispatch(setStatus("failed"));
      handleOrderError(dispatch, e);

      return;
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
  async (
    dispatch: AppDispatch
  ): Promise<SubmittedWithdrawTransaction | undefined> => {
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

      return transaction;
    } catch (e: any) {
      dispatch(setStatus("failed"));
      handleOrderError(dispatch, e);

      return;
    }
  };

export const approve =
  (
    amount: string,
    token: AppTokenInfo,
    library: Web3Provider,
    contractType: "Wrapper" | "Swap" | "SwapERC20" | "Delegate"
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setStatus("signing"));

    try {
      const approveAmount = isTokenInfo(token)
        ? toRoundedAtomicString(amount, token.decimals)
        : amount;
      const tokenKind = getTokenKind(token);
      const tokenId = isCollectionTokenInfo(token) ? token.id : undefined;

      const tx = await (tokenKind === TokenKinds.ERC20
        ? approveErc20Token(token.address, library, contractType, approveAmount)
        : approveNftToken(
            token.address,
            library,
            contractType,
            tokenKind,
            tokenId!,
            approveAmount
          ));

      if (isAppError(tx)) {
        const appError = tx;

        if (appError.type === AppErrorType.rejectedByUser) {
          dispatch(setStatus("idle"));
          notifyRejectedByUserError();
        } else {
          dispatch(setStatus("failed"));
          handleOrderError(dispatch, tx);
        }

        return;
      }

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

export const takeErc20 =
  (
    order: OrderERC20 | FullOrderERC20,
    signerToken: TokenInfo,
    senderToken: TokenInfo,
    library: Web3Provider,
    contractType: "SwapERC20" | "Wrapper"
  ) =>
  async (dispatch: AppDispatch): Promise<SubmittedOrder | undefined> => {
    dispatch(setStatus("signing"));

    const tx = await takeErc20Order(order, library, contractType);

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
      contractType === "SwapERC20"
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

    return transaction;
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
  async (
    dispatch: AppDispatch
  ): Promise<SubmittedOrderUnderConsideration | undefined> => {
    dispatch(setStatus("signing"));

    const servers = await Registry.getServers(
      library,
      chainId,
      ProtocolIds.LastLookERC20,
      signerToken.address,
      senderToken.address
    );

    const server = servers.find((server) => server.getUrl() === locator);

    if (!server) {
      console.error("[takeLastLookOrder] Server not found");

      return;
    }

    const signature = await createOrderERC20Signature(
      unsignedOrder,
      library.getSigner(),
      getSwapErc20Address(chainId)!,
      chainId
    );

    if (isAppError(signature)) {
      if (signature.type === AppErrorType.rejectedByUser) {
        notifyRejectedByUserError();
      }
      dispatch(setStatus("failed"));

      return;
    }

    dispatch(setStatus("requesting"));

    const order = transformUnsignedOrderERC20ToOrderERC20(
      unsignedOrder,
      signature
    );

    try {
      await server.considerOrderERC20(order);
    } catch (e) {
      console.error("[takeLastLookOrder] Error considering order", e);
    }

    server.disconnect();

    const transaction =
      transformToSubmittedTransactionWithOrderUnderConsideration(
        order,
        signerToken,
        senderToken
      );

    dispatch(submitTransaction(transaction));

    dispatch(setStatus("idle"));

    return transaction;
  };

interface TakeParams {
  senderWallet: string;
  order: FullOrder;
  library: Web3Provider;
  signerToken: AppTokenInfo;
  senderToken: AppTokenInfo;
}

export const takeFullOrder =
  (params: TakeParams) => async (dispatch: AppDispatch) => {
    const { order, senderWallet, signerToken, senderToken } = params;

    const tx = await takeFullOrderHelper(
      params.order,
      senderWallet,
      params.library
    );

    if (isAppError(tx)) {
      const appError = tx;

      if (appError.type === AppErrorType.rejectedByUser) {
        notifyRejectedByUserError();
      } else {
        dispatch(setErrors([appError]));
      }

      if (appError.error && "message" in appError.error) {
        dispatch(declineTransaction(appError.error.message));
      }

      dispatch(setStatus("failed"));

      return;
    }

    const transaction = transformToSubmittedTransactionWithOrder(
      tx.hash,
      order,
      signerToken,
      senderToken
    );

    dispatch(submitTransaction(transaction));
    dispatch(setStatus("idle"));

    return transaction;
  };
