import { errorCodes } from "eth-rpc-errors";

import translation from "../../public/locales/en/translation.json";

// These errors are located in the solidity contracts, so there is no way to directly source them.
export type AirswapProviderError =
  | "INVALID_SIG"
  | "EXPIRY_PASSED"
  | "UNAUTHORIZED"
  | "SIGNER_ALLOWANCE_LOW"
  | "SIGNER_BALANCE_LOW"
  | "NONCE_ALREADY_USED";

export type EthereumRPCError = keyof typeof errorCodes.rpc;

export type EthereumProviderError = keyof typeof errorCodes.provider;

export type Error =
  | AirswapProviderError
  | EthereumRPCError
  | EthereumProviderError;

export const ErrorCodesMap: Record<Error, number> = {
  INVALID_SIG: 0,
  EXPIRY_PASSED: 0,
  UNAUTHORIZED: 0,
  SIGNER_ALLOWANCE_LOW: 0,
  SIGNER_BALANCE_LOW: 0,
  NONCE_ALREADY_USED: 0,
  ...errorCodes.rpc,
  ...errorCodes.provider,
};

type ErrorTranslationKey = keyof typeof translation["validatorErrors"];

export const airswapProviderErrorList: AirswapProviderError[] = [
  "INVALID_SIG",
  "EXPIRY_PASSED",
  "UNAUTHORIZED",
  "SIGNER_ALLOWANCE_LOW",
  "SIGNER_BALANCE_LOW",
  "NONCE_ALREADY_USED",
];

export const airswapProviderErrorTranslationMap: Record<
  AirswapProviderError,
  ErrorTranslationKey
> = {
  INVALID_SIG: "invalid_sig",
  EXPIRY_PASSED: "expiry_passed",
  UNAUTHORIZED: "unauthorized",
  SIGNER_ALLOWANCE_LOW: "signer_allowance_low",
  SIGNER_BALANCE_LOW: "signer_balance_low",
  NONCE_ALREADY_USED: "nonce_already_used",
};
