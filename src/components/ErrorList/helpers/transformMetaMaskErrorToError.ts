import { errorCodes } from "eth-rpc-errors/dist/error-constants";
import { ProviderErrors, RPCErrors } from "../../../constants/errors";

export default function transformMetaMaskErrorToError(code: string): RPCErrors | ProviderErrors | undefined {
  const metaMaskErrors = { ...errorCodes.rpc, ...errorCodes.provider };
  const keys = Object.keys(metaMaskErrors) as (RPCErrors | ProviderErrors)[];

  return keys.find(key => metaMaskErrors[key] === parseInt(code, 0));
}
