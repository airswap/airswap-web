export enum AppErrorType {
  chainDisconnected = "chain-disconnected",
  disconnected = "disconnected",
  invalidAddress = "invalid-address",
  invalidValue = "invalid-value",
  rejectedByUser = "rejected-by-user",
  unauthorized = "unauthorized",
  unknownError = "unknown-error",
  unsupportedMethod = "unsupported-method",
}

export type AppError = {
  argument?: string;
  error: unknown;
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
  error: unknown,
  argument?: string
): AppError {
  return {
    argument,
    error,
    type,
  };
}
