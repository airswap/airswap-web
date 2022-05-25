import { errorCodes } from "eth-rpc-errors";

import translation from "../../public/locales/en/translation.json";

export type RPCError = {
  jsonrpc: "2.0";
  id: number;
  error: string;
};

export class ErrorWithCode extends Error {
  code: number = 0;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ErrorWithCode.prototype);
  }
}

// These errors come from the airswap swap contracts.
export type SwapError =
  | "SIGNATURE_INVALID"
  | "EXPIRY_PASSED"
  | "UNAUTHORIZED"
  | "SIGNER_ALLOWANCE_LOW"
  | "SIGNER_BALANCE_LOW"
  | "SENDER_ALLOWANCE_LOW"
  | "SENDER_BALANCE_LOW"
  | "NONCE_ALREADY_USED"
  | "UNPREDICTABLE_GAS_LIMIT";

export type EthereumRPCError = keyof typeof errorCodes.rpc;

export type EthereumProviderError = keyof typeof errorCodes.provider;

export type ErrorType = SwapError | EthereumRPCError | EthereumProviderError;

export const ErrorCodesMap: Record<ErrorType, number> = {
  SIGNATURE_INVALID: 0,
  EXPIRY_PASSED: 0,
  UNAUTHORIZED: 0,
  SIGNER_ALLOWANCE_LOW: 0,
  SIGNER_BALANCE_LOW: 0,
  SENDER_ALLOWANCE_LOW: 0,
  SENDER_BALANCE_LOW: 0,
  NONCE_ALREADY_USED: 0,
  UNPREDICTABLE_GAS_LIMIT: 0,
  ...errorCodes.rpc,
  ...errorCodes.provider,
};

type ErrorTranslationKey = keyof typeof translation["validatorErrors"];

export const swapErrorList: SwapError[] = [
  "SIGNATURE_INVALID",
  "EXPIRY_PASSED",
  "UNAUTHORIZED",
  "SIGNER_ALLOWANCE_LOW",
  "SIGNER_BALANCE_LOW",
  "SENDER_ALLOWANCE_LOW",
  "SENDER_BALANCE_LOW",
  "NONCE_ALREADY_USED",
  "UNPREDICTABLE_GAS_LIMIT",
];

export const swapErrorTranslationMap: Record<SwapError, ErrorTranslationKey> = {
  SIGNATURE_INVALID: "signature_invalid",
  EXPIRY_PASSED: "expiry_passed",
  UNAUTHORIZED: "unauthorized",
  SIGNER_ALLOWANCE_LOW: "signer_allowance_low",
  SIGNER_BALANCE_LOW: "signer_balance_low",
  NONCE_ALREADY_USED: "nonce_already_used",
  SENDER_ALLOWANCE_LOW: "sender_allowance_low",
  SENDER_BALANCE_LOW: "sender_balance_low",
  UNPREDICTABLE_GAS_LIMIT: "unpredictable_gas_limit",
};
