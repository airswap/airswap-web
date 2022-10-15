import * as SwapContract from "@airswap/swap/build/contracts/Swap.sol/Swap.json";
// @ts-ignore
import * as swapDeploys from "@airswap/swap/deploys";
import { FullOrder } from "@airswap/typescript";
import { decompressFullOrder, isValidFullOrder } from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { ethers, utils, Contract } from "ethers";

import {
  notifyRejectedByUserError,
  notifyError,
  notifyConfirmation,
} from "../../components/Toasts/ToastController";
import i18n from "../../i18n/i18n";
import { removeUserOrder } from "../myOrders/myOrdersSlice";
import {
  revertTransaction,
  submitTransaction,
} from "../transactions/transactionActions";
import { SubmittedCancellation } from "../transactions/transactionsSlice";
import { getTakenState } from "./takeOtcHelpers";
import { reset, setActiveOrder, setStatus } from "./takeOtcSlice";

const SwapInterface = new utils.Interface(JSON.stringify(SwapContract.abi));

export const decompressAndSetActiveOrder = createAsyncThunk(
  "take-otc/decompressAndSetActiveOrder",
  async (params: { compressedOrder: string }, { dispatch }) => {
    dispatch(reset());

    try {
      const order = decompressFullOrder(params.compressedOrder);

      if (!isValidFullOrder(order)) {
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
      order: FullOrder;
      chainId: number;
      library: ethers.providers.Web3Provider;
    },
    { dispatch }
  ) => {
    // pre-cancel checks
    const nonceUsed = await getTakenState(params.order, params.library);

    if (nonceUsed) {
      notifyError({
        heading: i18n.t("toast.cancelFail"),
        cta: i18n.t("validatorErrors.nonce_already_used"),
      });
      return;
    }

    // cancel initiated

    const SwapContract = new Contract(
      swapDeploys[params.chainId],
      SwapInterface,
      //@ts-ignore
      params.library.getSigner()
    );

    const tx = await SwapContract.cancel([params.order.nonce]).catch(
      (e: any) => {
        e.code === "ACTION_REJECTED"
          ? notifyRejectedByUserError()
          : notifyError({
              heading: i18n.t("toast.cancelFail"),
              cta: i18n.t("validatorErrors.unknownError"),
            });
        dispatch(revertTransaction(transaction));
        return;
      }
    );

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
    const isCancelled = await getTakenState(params.order, params.library);

    if (isCancelled) {
      notifyConfirmation({ heading: i18n.t("toast.cancelComplete"), cta: "" });
      dispatch(setStatus("canceled"));
      dispatch(removeUserOrder(params.order));
    } else {
      notifyError({
        heading: i18n.t("toast.cancelFail"),
        cta: i18n.t("validatorErrors.unknownError"),
      });

      dispatch(revertTransaction(transaction));
    }
  }
);
