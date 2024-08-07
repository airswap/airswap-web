import {
  createOrderERC20Signature as airSwapCreateSwapSignature,
  Signature,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";

import { AppError } from "../errors/appError";
import transformUnknownErrorToAppError from "../errors/transformUnknownErrorToAppError";

const SWAP_ERC20_VERSION = "4";

export const createOrderERC20Signature = (
  unsignedOrder: UnsignedOrderERC20,
  signer: JsonRpcSigner,
  swapContract: string,
  chainId: number
): Promise<Signature | AppError> => {
  return new Promise<Signature | AppError>(async (resolve) => {
    try {
      const signature = await airSwapCreateSwapSignature(
        unsignedOrder,
        // @ts-ignore
        signer,
        swapContract,
        chainId,
        SWAP_ERC20_VERSION
      );
      resolve(signature);
    } catch (error: unknown) {
      console.error(error);
      resolve(transformUnknownErrorToAppError(error));
    }
  });
};
