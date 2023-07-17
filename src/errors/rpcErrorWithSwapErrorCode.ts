import { AppError } from "./appError";
import {
  SwapError,
  swapErrors,
  transformSwapErrorToAppError,
} from "./swapError";

// An error with SwapError code where the real error code is in "reason", not "code". For example:
// {
//   reason: 'execution reverted: UNAUTHORIZED',
//   code: 'UNPREDICTABLE_GAS_LIMIT', // It basically always says UNPREDICTABLE_GAS_LIMIT
//   method: 'estimateGas',
// }

type RpcErrorWithSwapErrorCode = {
  code: SwapError;
  method: string;
  reason: string;
  transaction: any;
  error: {
    code: number; // Found in "eth-rpc-errors";
    data: any;
    message: string;
  };
};

export const isRpcErrorWithSwapErrorCode = (
  error: any
): error is RpcErrorWithSwapErrorCode => {
  return (
    typeof error === "object" &&
    "code" in error &&
    "method" in error &&
    "reason" in error &&
    swapErrors.includes(error.code)
  );
};

export const transformRpcErrorWithSwapErrorCodeToAppError = (
  error: RpcErrorWithSwapErrorCode
): AppError => {
  const reasonError = swapErrors.find(
    (swapError) => error.reason.indexOf(swapError) !== -1
  );
  return transformSwapErrorToAppError(reasonError || error.code);
};
