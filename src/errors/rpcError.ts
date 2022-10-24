import { errorCodes } from "eth-rpc-errors";

import { AppError, AppErrorType, transformToAppError } from "./appError";

export interface RpcError {
  code: number;
  message: any;
  stack: string;
}

export const isRpcError = (error: any): error is RpcError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    Object.values({ ...errorCodes.rpc, ...errorCodes.provider }).includes(
      error.code
    )
  );
};

export const transformRpcErrorToAppError = (error: RpcError): AppError => {
  if (error.code === 4001) {
    return transformToAppError(AppErrorType.rejectedByUser, error);
  }

  if (error.code === 4100) {
    return transformToAppError(AppErrorType.unauthorized, error);
  }

  if (error.code === 4200) {
    return transformToAppError(AppErrorType.unsupportedMethod, error);
  }

  if (error.code === 4900) {
    return transformToAppError(AppErrorType.disconnected, error);
  }

  if (error.code === 4901) {
    return transformToAppError(AppErrorType.chainDisconnected, error);
  }

  if (error.code === -32000) {
    return transformToAppError(AppErrorType.invalidInput, error);
  }

  if (error.code === -32600) {
    return transformToAppError(AppErrorType.invalidRequest, error);
  }

  // Add other errors from eth-rpc-errors if necessary.

  return transformToAppError(AppErrorType.unknownError, error);
};
