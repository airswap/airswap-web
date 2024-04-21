export const isPromiseFulfilledResult = <T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> => result.status === "fulfilled";
