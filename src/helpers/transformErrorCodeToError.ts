import { errorCodes } from "eth-rpc-errors/dist/error-constants";

import {
  SwapError,
  swapErrorList,
  ErrorType,
  EthereumProviderError,
  EthereumRPCError,
} from "../constants/errors";

export default function transformErrorCodeToError(
  code: number | SwapError
): ErrorType | undefined {
  const ethRpcErrors = { ...errorCodes.rpc, ...errorCodes.provider };
  const ethRpcErrorKeys = Object.keys(ethRpcErrors) as (
    | EthereumRPCError
    | EthereumProviderError
  )[];

  if (swapErrorList.some((error) => error === code)) {
    return code as SwapError;
  }

  return ethRpcErrorKeys.find((key) => ethRpcErrors[key] === code);
}
