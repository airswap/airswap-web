import { useMemo } from "react";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { AppTokenInfo } from "../entities/AppTokenInfo/AppTokenInfo";
import { selectBalances } from "../features/balances/balancesSlice";
import useMaxAmount from "./useMaxAmount";

const useInsufficientBalance = (
  tokenInfo: AppTokenInfo | null,
  requestedAmount: string,
  deductProtocolFee = false
): boolean => {
  const balances = useAppSelector(selectBalances);

  const availableAmount = useMaxAmount(tokenInfo || null, deductProtocolFee);

  return useMemo(() => {
    if (!availableAmount) return true;

    if (!tokenInfo || !requestedAmount) {
      return false;
    }

    if (parseFloat(requestedAmount) === 0 || requestedAmount === ".") {
      return false;
    }

    return new BigNumber(availableAmount).lt(new BigNumber(requestedAmount));
  }, [balances, tokenInfo, requestedAmount]);
};

export default useInsufficientBalance;
