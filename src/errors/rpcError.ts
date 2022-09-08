import { errorCodes } from "eth-rpc-errors";

import { AppError, AppErrorType, transformToAppError } from "./appError";

interface RpcError {
  code: number;
  message: string;
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
    return transformToAppError(AppErrorType.rejectedByUser);
  }

  if (error.code === 4100) {
    return transformToAppError(AppErrorType.unauthorized);
  }

  if (error.code === 4200) {
    return transformToAppError(AppErrorType.unsupportedMethod);
  }

  if (error.code === 4900) {
    return transformToAppError(AppErrorType.disconnected);
  }

  if (error.code === 4901) {
    return transformToAppError(AppErrorType.chainDisconnected);
  }

  return transformToAppError(AppErrorType.unknownError);
};
