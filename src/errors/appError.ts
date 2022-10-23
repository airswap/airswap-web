import { EthersProjectError } from "./ethersProjectError";
import { RpcError } from "./rpcError";
import { RpcSignRejectedError } from "./rpcSignRejectedError";

export enum AppErrorType {
  chainDisconnected = "chain-disconnected",
  disconnected = "disconnected",
  expiryPassed = "expiry-passed",
  invalidAddress = "invalid-address",
  invalidValue = "invalid-value",
  nonceAlreadyUsed = "nonce-already-used",
  rejectedByUser = "rejected-by-user",
  senderAllowanceLow = "senderAllowanceLow",
  senderBalanceLow = "senderBalanceLow",
  signerAllowanceLow = "signer-allowance-low",
  signerBalanceLow = "signer-balance-low",
  signatureInvalid = "signature-invalid",
  unauthorized = "unauthorized",
  unknownError = "unknown-error",
  unpredictableGasLimit = "unpredictable-gas-limit",
  unsupportedMethod = "unsupported-method",
}

export type AppError = {
  argument?: string;
  error?: RpcError | RpcSignRejectedError | EthersProjectError;
  type: AppErrorType;
};

export const isAppError = (x: any): x is AppError => {
  return (
    typeof x === "object" &&
    x !== null &&
    "type" in x &&
    Object.values(AppErrorType).includes(x.type)
  );
};

export function transformToAppError(
  type: AppErrorType,
  error?: RpcError | RpcSignRejectedError | EthersProjectError,
  argument?: string
): AppError {
  return {
    argument,
    error,
    type,
  };
}
