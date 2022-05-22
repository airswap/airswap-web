import {
  RPCError,
  ErrorWithCode,
  SwapError,
  swapErrorList,
} from "../constants/errors";

// We have two different kind of error formats that end up in the orders store, this helper is
// for extracting the SwapError or error code.

export default function getErrorCodesFromError(
  error: RPCError | ErrorWithCode
): (number | SwapError)[] {
  if ("code" in error) {
    return [error.code];
  }

  if ("error" in error) {
    return swapErrorList.filter(
      (swapError) => error.error.indexOf(swapError) !== -1
    );
  }

  return [];
}
