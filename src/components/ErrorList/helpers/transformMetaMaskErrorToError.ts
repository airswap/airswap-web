import { errorCodes } from "eth-rpc-errors/dist/error-constants";

import {
  EthereumProviderErrorType,
  RPCErrorType,
} from "../../../constants/errors";

export default function transformMetaMaskErrorToError(
  code: number
): RPCErrorType | EthereumProviderErrorType | undefined {
  const metaMaskErrors = { ...errorCodes.rpc, ...errorCodes.provider };
  const keys = Object.keys(metaMaskErrors) as (
    | RPCErrorType
    | EthereumProviderErrorType
  )[];

  return keys.find((key) => metaMaskErrors[key] === code);
}
