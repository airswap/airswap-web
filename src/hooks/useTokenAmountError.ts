import { AppError, isAppError } from "../errors/appError";
import toAtomicString from "../helpers/toAtomicString";
import { TokenInfo } from "@airswap/types";
import { useMemo } from "react";

const useTokenAmountError = (
  tokenInfo: TokenInfo | null,
  amount: string,
): AppError | undefined => {
  return useMemo(() => {
    if (!tokenInfo || !amount) {
      return undefined;
    }

    const result = toAtomicString(amount, tokenInfo.decimals);

    return isAppError(result) ? result : undefined;
  }, [tokenInfo, amount]);
};

export default useTokenAmountError;
