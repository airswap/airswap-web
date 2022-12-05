import { EthersProjectError } from "./ethersProjectError";
import { NumericFaultError } from "./numericFaultError";
import { RpcError } from "./rpcError";
import { RpcSignRejectedError } from "./rpcSignRejectedError";

export enum AppErrorType {
  arithmeticUnderflow = "arithmetic-underflow",
  chainDisconnected = "chain-disconnected",
  disconnected = "disconnected",
  expiryPassed = "expiry-passed",
  invalidAddress = "invalid-address",
  invalidInput = "invalid-input",
  invalidRequest = "invalid-request",
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
  error?:
    | RpcError
    | RpcSignRejectedError
    | EthersProjectError
    | NumericFaultError;
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
  error?: AppError["error"],
  argument?: string
): AppError {
  return {
    argument,
    error,
    type,
  };
}
