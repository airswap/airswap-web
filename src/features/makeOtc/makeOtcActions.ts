import { SwapERC20 } from "@airswap/libraries";
import { FullOrderERC20, UnsignedOrderERC20, TokenInfo } from "@airswap/types";
import { createOrderERC20, toAtomicString } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { ethers } from "ethers";

import {
  notifyOrderCreated,
  notifyRejectedByUserError,
} from "../../components/Toasts/ToastController";
import { AppErrorType, isAppError } from "../../errors/appError";
import { createOrderERC20Signature } from "../../helpers/createSwapSignature";
import { sendOrderToIndexers } from "../indexer/indexerHelpers";
import { setError, setStatus, setUserOrder } from "./makeOtcSlice";

export const createOtcOrder = createAsyncThunk(
  "make-otc/createOtcOrder",
  async (
    params: {
      activeIndexers: string[] | null;
      chainId: number;
      library: Web3Provider;
      signerTokenInfo: TokenInfo;
      senderTokenInfo: TokenInfo;
      shouldSendToIndexers: boolean;
    } & UnsignedOrderERC20,
    { dispatch }
  ) => {
    try {
      const signerWallet = ethers.utils.isAddress(params.signerWallet)
        ? params.signerWallet
        : await params.library.resolveName(params.signerWallet);

      if (!signerWallet) {
        dispatch(setStatus("failed"));
        dispatch(
          setError({
            type: AppErrorType.invalidAddress,
            argument: params.signerWallet,
          })
        );
        return;
      }

      const signerAmount = toAtomicString(
        params.signerAmount,
        params.signerTokenInfo.decimals
      );
      const senderAmount = toAtomicString(
        params.senderAmount,
        params.senderTokenInfo.decimals
      );

      const unsignedOrder = createOrderERC20({
        expiry: params.expiry,
        nonce: Date.now().toString(),
        senderWallet: params.senderWallet,
        signerWallet: signerWallet,
        signerToken: params.signerToken,
        senderToken: params.senderToken,
        protocolFee: "7",
        signerAmount,
        senderAmount,
        chainId: params.chainId,
      });

      dispatch(setStatus("signing"));

      const signature = await createOrderERC20Signature(
        unsignedOrder,
        params.library.getSigner(),
        SwapERC20.getAddress(params.chainId),
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

      const fullOrder: FullOrderERC20 = {
        ...unsignedOrder,
        ...signature,
        chainId: params.chainId,
        swapContract: SwapERC20.getAddress(params.chainId),
      };

      dispatch(setUserOrder(fullOrder));
      if (params.shouldSendToIndexers && params.activeIndexers) {
        sendOrderToIndexers(fullOrder, params.activeIndexers);
      }
      notifyOrderCreated(fullOrder);
    } catch (error) {
      console.error(error);
      dispatch(setStatus("failed"));
      dispatch(setError({ type: AppErrorType.unknownError }));
    }
  }
);
