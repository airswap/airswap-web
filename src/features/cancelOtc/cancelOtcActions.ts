import * as SwapContract from "@airswap/swap/build/contracts/Swap.sol/Swap.json";
// @ts-ignore
import * as swapDeploys from "@airswap/swap/deploys.js";
import { FullOrder } from "@airswap/typescript";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { ethers, utils, Contract } from "ethers";

import { notifyRejectedByUserError } from "../../components/Toasts/ToastController";
import { notifyConfirmation } from "../../components/Toasts/ToastController";
import { AppErrorType } from "../../errors/appError";
import { removeUserOrder } from "../myOrders/myOrdersSlice";
import { getTakenState } from "../takeOtc/takeOtcHelpers";
import {
  submitTransaction,
  revertTransaction,
} from "../transactions/transactionActions";
import {
  clear,
  SubmittedCancellation,
} from "../transactions/transactionsSlice";
import { reset, setCancelInProgress, setErrors } from "./cancelOtcSlice";

const SwapInterface = new utils.Interface(JSON.stringify(SwapContract.abi));

export const cancelOrder = createAsyncThunk(
  "cancel-otc/cancelOrder",
  async (
    params: {
      order: FullOrder;
      chainId: number;
      library: ethers.providers.Web3Provider;
    },
    { dispatch }
  ) => {
    // pre-cancel checks
    if (params.chainId.toString() !== params.order.chainId) {
      dispatch(
        setErrors({
          type: AppErrorType.unauthorized,
        })
      );
    }

    const nonceUsed = await getTakenState(params.order, params.library);

    if (nonceUsed) {
      dispatch(
        setErrors({
          type: AppErrorType.unsupportedMethod,
        })
      );
      return false;
    }

    // cancel initiated
    dispatch(setCancelInProgress(true));

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
          : dispatch(
              setErrors({
                type: AppErrorType.unknownError,
              })
            );
        dispatch(setCancelInProgress(false));
        return false;
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
      dispatch(reset());
      dispatch(clear());
      notifyConfirmation({ heading: "Order Cancelled", cta: "" });
      dispatch(removeUserOrder(params.order));
      return true;
    } else {
      dispatch(reset());
      dispatch(
        setErrors({
          type: AppErrorType.unknownError,
        })
      );
      dispatch(revertTransaction(transaction));
      return false;
    }
  }
);
