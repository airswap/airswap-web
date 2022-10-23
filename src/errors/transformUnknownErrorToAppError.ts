import { AppError, AppErrorType, transformToAppError } from "./appError";
import {
  isEthersProjectError,
  transformEthersProjectErrorToAppError,
} from "./ethersProjectError";
import { isRpcError, transformRpcErrorToAppError } from "./rpcError";
import {
  isRpcSignRejectedError,
  transformRpcSignRejectedErrorToAppError,
} from "./rpcSignRejectedError";

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

export default transformUnknownErrorToAppError;
