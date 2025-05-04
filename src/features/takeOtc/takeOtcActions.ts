import { SwapERC20 } from "@airswap/libraries";
import {
  decompressFullOrder,
  decompressFullOrderERC20,
  FullOrder,
  FullOrderERC20,
  isValidFullOrder as validateFullOrder,
  isValidFullOrderERC20 as validateErc20Order,
} from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { providers } from "ethers";

import {
  notifyError,
  notifyRejectedByUserError,
} from "../../components/Toasts/ToastController";
import { isFullOrder } from "../../entities/FullOrder/FullOrderHelpers";
import { cancelFullOrder } from "../../entities/FullOrder/FullOrderService";
import { cancelOrderErc20 } from "../../entities/OrderERC20/OrderERC20Service";
import { SubmittedCancellation } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import i18n from "../../i18n/i18n";
import {
  TransactionStatusType,
  TransactionTypes,
} from "../../types/transactionTypes";
import { removeOtcUserOrder } from "../myOtcOrders/myOtcOrdersSlice";
import { getNonceUsed } from "../orders/ordersHelpers";
import {
  revertTransaction,
  submitTransaction,
} from "../transactions/transactionsActions";
import { reset, setActiveOrder, setStatus } from "./takeOtcSlice";

export const decompressAndSetActiveOrder = createAsyncThunk(
  "take-otc/decompressAndSetActiveOrder",
  async (params: { compressedOrder: string }, { dispatch }) => {
    dispatch(reset());

    try {
      // TODO: Replace with decompressFullOrder
      const fullOrder = decompressFullOrder(params.compressedOrder);
      const erc20Order = decompressFullOrderERC20(params.compressedOrder);

      const isValidFullOrder = validateFullOrder(fullOrder);
      const isValidErc20Order = validateErc20Order(erc20Order);

      if (!isValidFullOrder && !isValidErc20Order) {
        return dispatch(setStatus("invalid"));
      }

      dispatch(setActiveOrder(isValidFullOrder ? fullOrder : erc20Order));

      dispatch(setStatus("open"));
    } catch (e) {
      console.error(e);
      dispatch(setStatus("invalid"));
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "take-otc/cancelOrder",
  async (
    params: {
      order: FullOrder | FullOrderERC20;
      chainId: number;
      library: providers.Web3Provider;
    },
    { dispatch }
  ) => {
    // pre-cancel checks
    const nonceUsed = await getNonceUsed(params.order, params.library);

    if (nonceUsed) {
      notifyError({
        heading: i18n.t("toast.cancelFailed"),
        cta: i18n.t("validatorErrors.nonce_already_used"),
      });
      dispatch(removeOtcUserOrder(params.order));
      return;
    }

    dispatch(setStatus("signing"));

    const tx = await (isFullOrder(params.order)
      ? cancelFullOrder(params.order, params.library)
      : cancelOrderErc20(params.order, params.library).catch((e: any) => {
          e.code === "ACTION_REJECTED"
            ? notifyRejectedByUserError()
            : notifyError({
                heading: i18n.t("toast.cancelFailed"),
                cta: i18n.t("validatorErrors.unknownError"),
              });
          dispatch(setStatus("failed"));
          dispatch(revertTransaction(transaction));
          return;
        }));

    if (!tx) {
      console.error("Transaction not found");
      return;
    }

    dispatch(setStatus("open"));

    const transaction: SubmittedCancellation = {
      type: TransactionTypes.cancel,
      status: TransactionStatusType.processing,
      hash: tx.hash,
      nonce: params.order.nonce,
      timestamp: Date.now(),
    };

    dispatch(submitTransaction(transaction));
  }
);
