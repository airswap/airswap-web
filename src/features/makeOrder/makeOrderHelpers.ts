import {
  createOrderSignature as airswapCreateOrderSignature,
  Signature,
  UnsignedOrder,
} from "@airswap/utils";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";

import { AppError } from "../../errors/appError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";

export const createOrderSignature = (
  unsignedOrder: UnsignedOrder,
  signer: JsonRpcSigner,
  swapContract: string,
  chainId: number
  // eslint-disable-next-line no-async-promise-executor
): Promise<Signature | AppError> =>
  new Promise<Signature | AppError>((resolve) => {
    try {
      airswapCreateOrderSignature(
        unsignedOrder,
        // @ts-ignore
        // Airswap library asking for incorrect VoidSigner. This will be fixed later.
        signer,
        swapContract,
        chainId
      ).then((signature) => {
        resolve(signature);
      });
    } catch (error: unknown) {
      console.error(error);
      resolve(transformUnknownErrorToAppError(error));
    }
  });
