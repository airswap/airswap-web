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
  argument?: string
): AppError {
  return {
    argument,
    type,
  };
}
