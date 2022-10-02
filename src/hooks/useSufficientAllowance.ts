import { useMemo } from "react";

import { TokenInfo } from "@airswap/typescript";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { nativeCurrencyAddress } from "../constants/nativeCurrency";
import { selectAllowances } from "../features/balances/balancesSlice";
import { SwapType } from "../types/swapType";

const useSufficientAllowance = (
  token: TokenInfo | null,
  swapType: SwapType,
  amount?: string
): boolean => {
  const allowances = useAppSelector(selectAllowances);

  return useMemo(() => {
    if (!token || !amount) {
      return false;
    }

    if (token.address === nativeCurrencyAddress) {
      return true;
    }

    const allowancesType = swapType === "swapWithWrap" ? "wrapper" : "swap";
    const tokenAllowance = allowances[allowancesType].values[token.address];

    if (!tokenAllowance) {
      // safer to return true here (has allowance) as validator will catch the
      // missing allowance, so the user won't swap, and they won't pay
      // unnecessary gas for an approval they may not need.
      return true;
    }

    return new BigNumber(tokenAllowance).div(10 ** token.decimals).gte(amount);
  }, [allowances, amount, token, swapType]);
};

export default useSufficientAllowance;
