import { Signature, UnsignedOrder } from "@airswap/typescript";
import { createSwapSignature as airswapCreateSwapSignature } from "@airswap/utils";
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider";

import {
  AppError,
  AppErrorType,
  transformToAppError,
} from "../errors/appError";
import {
  isEthersProjectError,
  transformEthersProjectErrorToAppError,
} from "../errors/ethersProjectError";
import { isRpcError, transformRpcErrorToAppError } from "../errors/rpcError";
import {
  isRpcSignRejectedError,
  transformRpcSignRejectedErrorToAppError,
} from "../errors/rpcSignRejectedError";

const transformUnknownErrorToAppError = (error: any): AppError => {
  if (isRpcError(error)) {
    return transformRpcErrorToAppError(error);
  }

  if (isEthersProjectError(error)) {
    return transformEthersProjectErrorToAppError(error);
  }

  if (isRpcSignRejectedError(error)) {
    return transformRpcSignRejectedErrorToAppError(error);
  }

  return transformToAppError(AppErrorType.unknownError, error);
};

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
