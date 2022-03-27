import { errorCodes } from "eth-rpc-errors";

export type AirswapProviderErrors =
  | "INVALID_SIG"
  | "EXPIRY_PASSED"
  | "UNAUTHORIZED"
  | "SIGNER_ALLOWANCE_LOW"
  | "SIGNER_BALANCE_LOW"
  | "NONCE_ALREADY_USED";

export type RPCErrors = keyof typeof errorCodes.rpc;

export type ProviderErrors = keyof typeof errorCodes.provider;

export type ErrorType = AirswapProviderErrors | RPCErrors | ProviderErrors;

export const airswapProviderErrorList: AirswapProviderErrors[] = [
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
