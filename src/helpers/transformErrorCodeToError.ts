import { errorCodes } from "eth-rpc-errors/dist/error-constants";

import { EthereumProviderError, EthereumRPCError } from "../constants/errors";

export default function transformErrorCodeToError(
  code: number
): EthereumRPCError | EthereumProviderError | undefined {
  const ethRpcErrors = { ...errorCodes.rpc, ...errorCodes.provider };
  const keys = Object.keys(ethRpcErrors) as (
    | EthereumRPCError
    | EthereumProviderError
  )[];

  return keys.find((key) => ethRpcErrors[key] === code);
}
