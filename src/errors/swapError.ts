import { AppError, AppErrorType, transformToAppError } from "./appError";

// These errors come from the airswap swap contracts.
export type SwapError =
  | "EXPIRY_PASSED"
  | "SIGNATURE_INVALID"
  | "SIGNER_ALLOWANCE_LOW"
  | "SIGNER_BALANCE_LOW"
  | "SENDER_ALLOWANCE_LOW"
  | "SENDER_BALANCE_LOW"
  | "NONCE_ALREADY_USED"
  | "UNAUTHORIZED"
  | "UNPREDICTABLE_GAS_LIMIT";

export const swapErrors: SwapError[] = [
  "EXPIRY_PASSED",
  "SIGNATURE_INVALID",
  "SIGNER_ALLOWANCE_LOW",
  "SIGNER_BALANCE_LOW",
  "SENDER_ALLOWANCE_LOW",
  "SENDER_BALANCE_LOW",
  "NONCE_ALREADY_USED",
  "UNAUTHORIZED",
  "UNPREDICTABLE_GAS_LIMIT",
];

export const isSwapError = (error: any): error is SwapError => {
  return swapErrors.includes(error || error.code);
};

export const transformSwapErrorToAppError = (error: SwapError): AppError => {
  if (error === "EXPIRY_PASSED") {
    return transformToAppError(AppErrorType.expiryPassed);
  }

  if (error === "NONCE_ALREADY_USED") {
    return transformToAppError(AppErrorType.nonceAlreadyUsed);
  }

  if (error === "SENDER_ALLOWANCE_LOW") {
    return transformToAppError(AppErrorType.senderAllowanceLow);
  }

  if (error === "SENDER_BALANCE_LOW") {
    return transformToAppError(AppErrorType.senderBalanceLow);
  }

  if (error === "SIGNER_ALLOWANCE_LOW") {
    return transformToAppError(AppErrorType.signerAllowanceLow);
  }

  if (error === "SIGNER_BALANCE_LOW") {
    return transformToAppError(AppErrorType.signerBalanceLow);
  }

  if (error === "SIGNATURE_INVALID") {
    return transformToAppError(AppErrorType.signatureInvalid);
  }

  if (error === "UNAUTHORIZED") {
    return transformToAppError(AppErrorType.unauthorized);
  }

  if (error === "UNPREDICTABLE_GAS_LIMIT") {
    return transformToAppError(AppErrorType.unpredictableGasLimit);
  }

  return transformToAppError(AppErrorType.unknownError);
};
