import { Signature, UnsignedOrder } from "@airswap/typescript";
import { createSwapSignature as airswapCreateSwapSignature } from "@airswap/utils";

import { ethers } from "ethers";

import { AppError, AppErrorType, transformToAppError } from "../types/appError";

export interface CreateSwapSignatureError {
  argument: string;
  value: string;
  code: "INVALID_ARGUMENT";
}

const transformUnknownErrorToAppError = (error: any): AppError => {
  if (error.code === 4001) {
    return transformToAppError(AppErrorType.rejectedByUser, error);
  }

  if (error.argument === "address") {
    return transformToAppError(
      AppErrorType.invalidAddress,
      error,
      error.argument
    );
  }

  if (error.argument === "value") {
    return transformToAppError(
      AppErrorType.invalidValue,
      error,
      error.argument
    );
  }

  return transformToAppError(AppErrorType.unknownError, error);
};

export const createSwapSignature = (
  unsignedOrder: UnsignedOrder,
  signer: ethers.VoidSigner | string,
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
    } catch (e: unknown) {
      resolve(transformUnknownErrorToAppError(e));
    }
  });
};
