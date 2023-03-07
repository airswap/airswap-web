import { AppError, AppErrorType, transformToAppError } from "./appError";

// These errors come from the airswap swap contracts.
export type SwapError =
  | "OrderExpired"
  | "SignatureInvalid"
  | "SignerAllowanceLow"
  | "SignerBalanceLow"
  | "SenderAllowanceLow"
  | "SenderBalanceLow"
  | "NonceAlreadyUsed"
  | "Unauthorized"
  | "UNPREDICTABLE_GAS_LIMIT";

export const swapErrors: SwapError[] = [
  "OrderExpired",
  "SignatureInvalid",
  "SignerAllowanceLow",
  "SignerBalanceLow",
  "SenderAllowanceLow",
  "SenderBalanceLow",
  "NonceAlreadyUsed",
  "Unauthorized",
  "UNPREDICTABLE_GAS_LIMIT",
];

export const isSwapError = (error: any): error is SwapError => {
  return swapErrors.includes(error || error.code);
};

export const transformSwapErrorToAppError = (error: SwapError): AppError => {
  if (error === "OrderExpired") {
    return transformToAppError(AppErrorType.expiryPassed);
  }

  if (error === "NonceAlreadyUsed") {
    return transformToAppError(AppErrorType.nonceAlreadyUsed);
  }

  if (error === "SenderAllowanceLow") {
    return transformToAppError(AppErrorType.senderAllowanceLow);
  }

  if (error === "SenderBalanceLow") {
    return transformToAppError(AppErrorType.senderBalanceLow);
  }

  if (error === "SignerAllowanceLow") {
    return transformToAppError(AppErrorType.signerAllowanceLow);
  }

  if (error === "SignerBalanceLow") {
    return transformToAppError(AppErrorType.signerBalanceLow);
  }

  if (error === "SignatureInvalid") {
    return transformToAppError(AppErrorType.signatureInvalid);
  }

  if (error === "Unauthorized") {
    return transformToAppError(AppErrorType.unauthorized);
  }

  if (error === "UNPREDICTABLE_GAS_LIMIT") {
    return transformToAppError(AppErrorType.unpredictableGasLimit);
  }

  return transformToAppError(AppErrorType.unknownError);
};
