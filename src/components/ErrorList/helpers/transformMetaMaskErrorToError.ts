import { errorCodes } from "eth-rpc-errors/dist/error-constants";

import {
  EthereumProviderError,
  EthereumRPCError,
} from "../../../constants/errors";

export default function transformMetaMaskErrorToError(
  code: number
): EthereumRPCError | EthereumProviderError | undefined {
  const metaMaskErrors = { ...errorCodes.rpc, ...errorCodes.provider };
  const keys = Object.keys(metaMaskErrors) as (
    | EthereumRPCError
    | EthereumProviderError
  )[];

  return keys.find((key) => metaMaskErrors[key] === code);
}
