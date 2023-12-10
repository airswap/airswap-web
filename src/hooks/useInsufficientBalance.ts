import { useMemo } from "react";

import { TokenInfo } from "@airswap/types";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { selectBalances } from "../features/balances/balancesSlice";
import useMaxAmount from "./useMaxAmount";

const useInsufficientBalance = (
  tokenInfo: TokenInfo | null,
  amount: string,
  deductProtocolFee = false
): boolean => {
  const balances = useAppSelector(selectBalances);

  const maxAmount = useMaxAmount(tokenInfo?.address || null, deductProtocolFee);

  return useMemo(() => {
    if (!tokenInfo || !amount || !maxAmount) {
      return false;
    }

    if (parseFloat(amount) === 0 || amount === ".") {
      return false;
    }

    return new BigNumber(maxAmount).lt(new BigNumber(amount));
  }, [balances, tokenInfo, amount]);
};

export default useInsufficientBalance;
