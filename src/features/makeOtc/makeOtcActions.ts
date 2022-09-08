// @ts-ignore
import * as swapDeploys from "@airswap/swap/deploys.js";
import { FullOrder, UnsignedOrder } from "@airswap/typescript";
import { createOrder } from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { notifyRejectedByUserError } from "../../components/Toasts/ToastController";
import {AppErrorType, isAppError} from "../../errors/appError";
import { createSwapSignature } from "../../helpers/createSwapSignature";
import { setError, setStatus, setUserOrder } from "./makeOtcSlice";

export const createOtcOrder = createAsyncThunk(
  "make-otc/createOtcOrder",
  async (
    params: {
      chainId: number;
      library: any;
    } & UnsignedOrder,
    { dispatch }
  ) => {
    dispatch(setStatus("signing"));

    try {
      const unsignedOrder = createOrder({
        expiry: params.expiry,
        nonce: Date.now().toString(),
        senderWallet: params.senderWallet,
        signerWallet: params.signerWallet,
        signerToken: params.signerToken,
        senderToken: params.senderToken,
        protocolFee: "7",
        signerAmount: params.signerAmount,
        senderAmount: params.senderAmount,
        chainId: params.chainId,
      });

      const signature = await createSwapSignature(
        unsignedOrder,
        params.library.getSigner(),
        swapDeploys[params.chainId],
        params.chainId
      );

      if (isAppError(signature)) {
        if (signature.type === AppErrorType.rejectedByUser) {
          dispatch(setStatus("idle"));
          notifyRejectedByUserError();
        } else {
          dispatch(setStatus("failed"));
          dispatch(setError(signature));
        }
        return;
      }

      const fullOrder: FullOrder = {
        ...unsignedOrder,
        ...signature,
        chainId: params.chainId.toString(),
        swapContract: swapDeploys[params.chainId],
      };

      dispatch(setUserOrder(fullOrder));
    } catch (error) {
      console.log(error);
      dispatch(setStatus("failed"));
      dispatch(setError({ type: AppErrorType.unknownError }));
    }
  }
);
