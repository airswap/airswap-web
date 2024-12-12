import {
  createOrderERC20Signature as airSwapCreateSwapSignature,
  Signature,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";

import { AppError } from "../errors/appError";
import transformUnknownErrorToAppError from "../errors/transformUnknownErrorToAppError";

export const createOrderERC20Signature = (
  unsignedOrder: UnsignedOrderERC20,
  signer: JsonRpcSigner,
  swapContract: string,
  chainId: number
): Promise<Signature | AppError> => {
  return new Promise<Signature | AppError>((resolve) => {
    airSwapCreateSwapSignature(
      unsignedOrder,
      // @ts-ignore
      signer,
      swapContract,
      chainId
    )
      .then(resolve)
      .catch((error) => {
        console.error(error);
        resolve(transformUnknownErrorToAppError(error));
      });
  });
};
