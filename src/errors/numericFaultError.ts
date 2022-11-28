import { AppError, AppErrorType, transformToAppError } from "./appError";

// https://docs.ethers.io/v5/troubleshooting/errors/#help-NUMERIC_FAULT

// Illegal operation with numeric values, like parsing a value with more decimals than the type:
// utils.parseUnits("1.34", 1);
// [Error: fractional component exceeds decimals [ See: https://links.ethers.org/v5-errors-NUMERIC_FAULT ]] {
//   code: 'NUMERIC_FAULT',
//   fault: 'underflow',
//   operation: 'parseFixed',
//   reason: 'fractional component exceeds decimals'
// }

export interface NumericFaultError {
  code: "NUMERIC_FAULT";
  fault: string;
  operation: string;
  reason: string;
  value?: number;
}

export const isNumericFaultErrorError = (
  error: any
): error is NumericFaultError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "fault" in error &&
    "operation" in error &&
    "reason" in error &&
    error.code === "NUMERIC_FAULT"
  );
};

export const transformNumericFaultErrorErrorToAppError = (
  error: NumericFaultError
): AppError => {
  if (error.fault === "underflow") {
    return transformToAppError(
      AppErrorType.arithmeticUnderflow,
      error,
      error.reason
    );
  }

  return transformToAppError(AppErrorType.unknownError, error);
};
