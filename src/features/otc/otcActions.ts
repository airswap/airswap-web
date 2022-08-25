// @ts-ignore
import * as swapDeploys from "@airswap/swap/deploys.js";
import { FullOrder, UnsignedOrder } from "@airswap/typescript";
import {
  compressFullOrder,
  createOrder,
  createSwapSignature,
} from "@airswap/utils";

import { setStatus } from "./otcSlice";

export const createOtcOrder =
  (
    params: {
      chainId: number;
      library: any;
    } & UnsignedOrder
  ) =>
  async (dispatch: any): Promise<string | undefined> => {
    console.log(params);
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

      const fullOrder: FullOrder = {
        ...unsignedOrder,
        ...signature,
        chainId: params.chainId.toString(),
        swapContract: swapDeploys[params.chainId],
      };

      return compressFullOrder(fullOrder);
    } catch (e) {
      console.log(e);

      return undefined;
    } finally {
      dispatch(setStatus("idle"));
    }
  };
