import { AppError, AppErrorType, transformToAppError } from "./appError";

// Error from eth-sig-util I think. Not totally sure. Might rename this later

interface EthSigUtilError {
  argument: string;
  value: string;
  code: "INVALID_ARGUMENT";
}

export const isEthSigUtilError = (error: any): error is EthSigUtilError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "argument" in error &&
    "value" in error &&
    "code" in error
  );
};

export const transformEthSigUtilErrorToAppError = (
  error: EthSigUtilError
): AppError => {
  if (error.argument === "address") {
    return transformToAppError(AppErrorType.invalidAddress, error, error.value);
  }

  if (error.argument === "value") {
    return transformToAppError(AppErrorType.invalidValue, error, error.value);
  }

  return transformToAppError(AppErrorType.unknownError, error);
};
