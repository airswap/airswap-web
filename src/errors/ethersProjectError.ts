import { AppError, AppErrorType, transformToAppError } from "./appError";

// @ethersproject's logger throws errors like this:

// throwArgumentError(message: string, name: string, value: any): never {
//   return this.throwError(message, Logger.errors.INVALID_ARGUMENT, {
//     argument: name,
//     value: value
//   });
// }

export interface EthersProjectError {
  argument: string;
  value: string;
  code: "INVALID_ARGUMENT";
}

export const isEthersProjectError = (
  error: any
): error is EthersProjectError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "argument" in error &&
    "value" in error &&
    "code" in error
  );
};

export const transformEthersProjectErrorToAppError = (
  error: EthersProjectError
): AppError => {
  if (error.argument === "address") {
    return transformToAppError(AppErrorType.invalidAddress, error, error.value);
  }

  if (error.argument === "value") {
    return transformToAppError(AppErrorType.invalidValue, error, error.value);
  }

  return transformToAppError(AppErrorType.unknownError, error);
};
