import { useMemo } from "react";

import { TokenInfo } from "@uniswap/token-lists";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { isTokenInfo } from "../entities/TokenInfo/TokenInfoHelpers";
import { UnknownToken } from "../entities/UnknownToken/UnknownToken";
import { selectBalances } from "../features/balances/balancesSlice";

const useInsufficientBalance = (
  tokenInfo: TokenInfo | UnknownToken | null,
  amount: string
): boolean => {
  const balances = useAppSelector(selectBalances);

  return useMemo(() => {
    if (!tokenInfo || !amount || !isTokenInfo(tokenInfo)) {
      return false;
    }

    if (parseFloat(amount) === 0 || amount === ".") {
      return false;
    }

    if (!tokenInfo.decimals) {
      return false;
    }

    return new BigNumber(balances.values[tokenInfo.address] || "0").lt(
      new BigNumber(amount).multipliedBy(10 ** tokenInfo.decimals)
    );
  }, [balances, tokenInfo, amount]);
};

export default useInsufficientBalance;
