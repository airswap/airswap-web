import { SwapERC20 } from "@airswap/libraries";
import { FullOrderERC20 } from "@airswap/types";
import {
  decompressFullOrderERC20,
  isValidFullOrderERC20,
} from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { providers } from "ethers";

import {
  notifyRejectedByUserError,
  notifyError,
  notifyConfirmation,
} from "../../components/Toasts/ToastController";
import i18n from "../../i18n/i18n";
import { removeUserOrder } from "../myOrders/myOrdersSlice";
import { getNonceUsed } from "../orders/orderApi";
import {
  mineTransaction,
  revertTransaction,
  submitTransaction,
} from "../transactions/transactionActions";
import { SubmittedCancellation } from "../transactions/transactionsSlice";
import {
  reset,
  setActiveOrder,
  setIsCancelSuccessFull,
  setStatus,
} from "./takeOtcSlice";

export const decompressAndSetActiveOrder = createAsyncThunk(
  "take-otc/decompressAndSetActiveOrder",
  async (params: { compressedOrder: string }, { dispatch }) => {
    dispatch(reset());

    try {
      const order = decompressFullOrderERC20(params.compressedOrder);

      if (!isValidFullOrderERC20(order)) {
        return dispatch(setStatus("not-found"));
      }

      dispatch(setActiveOrder(order));

      dispatch(setStatus("open"));
    } catch (e) {
      console.error(e);
      dispatch(setStatus("not-found"));
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "take-otc/cancelOrder",
  async (
    params: {
      order: FullOrderERC20;
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
      dispatch(removeUserOrder(params.order));
      return;
    }

    dispatch(setStatus("signing"));

    const tx = await SwapERC20.getContract(
      params.library.getSigner(),
      params.chainId
    )
      .cancel([params.order.nonce])
      .catch((e: any) => {
        e.code === "ACTION_REJECTED"
          ? notifyRejectedByUserError()
          : notifyError({
              heading: i18n.t("toast.cancelFailed"),
              cta: i18n.t("validatorErrors.unknownError"),
            });
        dispatch(setStatus("failed"));
        dispatch(revertTransaction(transaction));
        return;
      });

    dispatch(setStatus("open"));

    const transaction: SubmittedCancellation = {
      type: "Cancel",
      status: "processing",
      hash: tx.hash,
      nonce: params.order.nonce,
      timestamp: Date.now(),
    };
    dispatch(submitTransaction(transaction));

    await tx.wait();

    // post-cancel clean up
    const isCancelled = await getNonceUsed(params.order, params.library);
    dispatch(mineTransaction(tx));

    if (isCancelled) {
      dispatch(setIsCancelSuccessFull(true));
      notifyConfirmation({ heading: i18n.t("toast.cancelComplete"), cta: "" });
    } else {
      notifyError({
        heading: i18n.t("toast.cancelFailed"),
        cta: i18n.t("validatorErrors.unknownError"),
      });
    }
  }
);
