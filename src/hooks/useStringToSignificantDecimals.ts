import { useMemo } from "react";

import { TokenInfo } from "@airswap/types";
import { format } from "@greypixel_/nicenumbers";

import { isAppError } from "../errors/appError";
import toAtomicString from "../helpers/toAtomicString";

const useStringToSignificantDecimals = (
  amount: string,
  token: TokenInfo | null
): string => {
  return useMemo(() => {
    if (!token) {
      return "0";
    }

    const tokenAmountBigNumber = toAtomicString(amount, token.decimals);

    if (isAppError(tokenAmountBigNumber)) {
      return "0";
    }

    return format(tokenAmountBigNumber, {
      omitTrailingZeroes: true,
      omitLeadingZero: true,
      significantFigures: 10,
      tokenDecimals: token.decimals,
      useSymbols: false,
    });
  }, [amount, token]);
};

export default useStringToSignificantDecimals;
