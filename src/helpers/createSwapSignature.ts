import { Signature, UnsignedOrder } from "@airswap/typescript";
import { createSwapSignature as airswapCreateSwapSignature } from "@airswap/utils";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";

import { AppError } from "../errors/appError";
import transformUnknownErrorToAppError from "../errors/transformUnknownErrorToAppError";

export const createSwapSignature = (
  unsignedOrder: UnsignedOrder,
  signer: JsonRpcSigner,
  swapContract: string,
  chainId: number
): Promise<Signature | AppError> => {
  return new Promise<Signature | AppError>(async (resolve) => {
    try {
      const signature = await airswapCreateSwapSignature(
        unsignedOrder,
        // @ts-ignore
        signer,
        swapContract,
        chainId
      );
      resolve(signature);
    } catch (error: unknown) {
      console.error(error);
      resolve(transformUnknownErrorToAppError(error));
    }
  });
};
