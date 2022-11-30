import { AppError, AppErrorType, transformToAppError } from "./appError";
import {
  isEthersProjectError,
  transformEthersProjectErrorToAppError,
} from "./ethersProjectError";
import {
  isNumericFaultErrorError,
  transformNumericFaultErrorErrorToAppError,
} from "./numericFaultError";
import { isRpcError, transformRpcErrorToAppError } from "./rpcError";
import {
  isRpcErrorWithSwapErrorCode,
  transformRpcErrorWithSwapErrorCodeToAppError,
} from "./rpcErrorWithSwapErrorCode";
import {
  isRpcSignRejectedError,
  transformRpcSignRejectedErrorToAppError,
} from "./rpcSignRejectedError";
import { isSwapError, transformSwapErrorToAppError } from "./swapError";

const transformUnknownErrorToAppError = (error: any): AppError => {
  if (isRpcError(error)) {
    return transformRpcErrorToAppError(error);
  }

  if (isEthersProjectError(error)) {
    return transformEthersProjectErrorToAppError(error);
  }

  if (isNumericFaultErrorError(error)) {
    return transformNumericFaultErrorErrorToAppError(error);
  }

  if (isRpcSignRejectedError(error)) {
    return transformRpcSignRejectedErrorToAppError(error);
  }

  if (isRpcErrorWithSwapErrorCode(error)) {
    return transformRpcErrorWithSwapErrorCodeToAppError(error);
  }

  if (isSwapError(error)) {
    return transformSwapErrorToAppError(error);
  }

  return transformToAppError(AppErrorType.unknownError, error);
};

export default transformUnknownErrorToAppError;
