import { errorCodes } from "eth-rpc-errors";

export type AirswapProviderErrorType =
  | "INVALID_SIG"
  | "EXPIRY_PASSED"
  | "UNAUTHORIZED"
  | "SIGNER_ALLOWANCE_LOW"
  | "SIGNER_BALANCE_LOW"
  | "NONCE_ALREADY_USED";

export type RPCErrorType = keyof typeof errorCodes.rpc;

export type EthereumProviderErrorType = keyof typeof errorCodes.provider;

export type ErrorType =
  | AirswapProviderErrorType
  | RPCErrorType
  | EthereumProviderErrorType;

export const airswapProviderErrorList: AirswapProviderErrorType[] = [
  "INVALID_SIG",
  "EXPIRY_PASSED",
  "UNAUTHORIZED",
  "SIGNER_ALLOWANCE_LOW",
  "SIGNER_BALANCE_LOW",
  "NONCE_ALREADY_USED",
];

export const ErrorCodes: Record<ErrorType, number> = {
  INVALID_SIG: 0,
  EXPIRY_PASSED: 0,
  UNAUTHORIZED: 0,
  SIGNER_ALLOWANCE_LOW: 0,
  SIGNER_BALANCE_LOW: 0,
  NONCE_ALREADY_USED: 0,
  ...errorCodes.rpc,
  ...errorCodes.provider,
};
