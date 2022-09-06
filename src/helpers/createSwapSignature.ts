import { Signature, UnsignedOrder } from "@airswap/typescript";
import { createSwapSignature as airswapCreateSwapSignature } from "@airswap/utils";

import { ethers } from "ethers";

import { AppError, AppErrorType, transformToAppError } from "../types/appError";

const transformUnknownErrorToAppError = (error: any): AppError => {
  // Error code could be an eth rpc or provider error found here:
  // node_modules/eth-rpc-errors/dist/error-constants.d.ts

  if (error.code === 4001) {
    return transformToAppError(AppErrorType.rejectedByUser, error);
  }

  if (error.code === 4100) {
    return transformToAppError(AppErrorType.unauthorized, error);
  }

  // Or there's a different error from eth-sig-util I think. Which looks like this:
  // argument: string;
  // value: string;
  // code: "INVALID_ARGUMENT";

  if (error.argument === "address") {
    return transformToAppError(AppErrorType.invalidAddress, error, error.value);
  }

  if (error.argument === "value") {
    return transformToAppError(AppErrorType.invalidValue, error, error.value);
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
