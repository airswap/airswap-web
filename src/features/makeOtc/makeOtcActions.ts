import {
  createOrderERC20,
  toAtomicString,
  FullOrderERC20,
  UnsignedOrderERC20,
  TokenInfo,
} from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { ethers } from "ethers";

import {
  notifyOrderCreated,
  notifyRejectedByUserError,
} from "../../components/Toasts/ToastController";
import { AppErrorType, isAppError } from "../../errors/appError";
import { createOrderERC20Signature } from "../../helpers/createSwapSignature";
import { getSwapErc20Address } from "../../helpers/swapErc20";
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
        protocolFee: params.protocolFee,
        signerAmount,
        senderAmount,
        chainId: params.chainId,
      });

      dispatch(setStatus("signing"));

      const signature = await createOrderERC20Signature(
        unsignedOrder,
        params.library.getSigner(),
        getSwapErc20Address(params.chainId) || "",
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
        swapContract: getSwapErc20Address(params.chainId) || "",
      };

      if (params.shouldSendToIndexers && params.activeIndexers) {
        sendOrderToIndexers(fullOrder, params.activeIndexers);
      }

      dispatch(setUserOrder(fullOrder));
    } catch (error) {
      console.error(error);
      dispatch(setStatus("failed"));
      dispatch(setError({ type: AppErrorType.unknownError }));
    }
  }
);
