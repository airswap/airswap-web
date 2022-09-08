import { errorCodes } from "eth-rpc-errors";

import { ErrorWithCode } from "../constants/errors";
import { AppError, AppErrorType, transformToAppError } from "./appError";

export const isRpcError = (error: any): error is ErrorWithCode => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    Object.values({ ...errorCodes.rpc, ...errorCodes.provider }).includes(
      error.code
    )
  );
};

export const transformRpcErrorToAppError = (error: ErrorWithCode): AppError => {
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

  return transformToAppError(AppErrorType.unknownError, error);
};
