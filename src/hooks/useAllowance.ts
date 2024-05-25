import { useEffect, useState } from "react";

import { TokenInfo, ADDRESS_ZERO } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { selectAllowances } from "../features/balances/balancesSlice";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";
import getWethAddress from "../helpers/getWethAddress";

const useAllowance = (
  token: TokenInfo | null,
  amount?: string,
  wrapNativeToken?: boolean
): {
  hasSufficientAllowance: boolean;
  allowance: string;
  readableAllowance: string;
} => {
  const { chainId } = useAppSelector((state) => state.web3);
  const allTokens = useAppSelector(selectAllTokenInfo);
  const allowances = useAppSelector(selectAllowances);

  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);
  const [allowance, setAllowance] = useState("0");
  const [readableAllowance, setReadableAllowance] = useState("0");

  const reset = () => {
    setHasSufficientAllowance(false);
    setAllowance("0");
    setReadableAllowance("0");
  };

  useEffect(() => {
    if (!token || !amount || !chainId) {
      reset();

      return;
    }

    // ETH can't have allowance because it's not a token. So we default to WETH when wrapNativeToken is true.

    if (token.address === ADDRESS_ZERO && !wrapNativeToken) {
      setHasSufficientAllowance(true);
      setAllowance("0");
      setReadableAllowance("0");

      return;
    }

    const justifiedAddress =
      token.address === ADDRESS_ZERO ? getWethAddress(chainId) : token.address;

    const justifiedToken = findEthOrTokenByAddress(
      justifiedAddress,
      allTokens,
      chainId
    );

    if (!justifiedToken) {
      reset();

      return;
    }

    const tokenAllowance = allowances.swap.values[justifiedToken.address];

    if (!tokenAllowance) {
      // safer to return true here (has allowance) as validator will catch the
      // missing allowance, so the user won't swap, and they won't pay
      // unnecessary gas for an approval they may not need.

      setHasSufficientAllowance(true);
      setAllowance("0");
      setReadableAllowance("0");

      return;
    }

    const newReadableTokenAllowance = new BigNumber(tokenAllowance)
      .div(10 ** justifiedToken.decimals)
      .toString();

    const newHasSufficientAllowance = new BigNumber(tokenAllowance)
      .div(10 ** justifiedToken.decimals)
      .gte(amount);

    setHasSufficientAllowance(newHasSufficientAllowance);
    setAllowance(tokenAllowance);
    setReadableAllowance(newReadableTokenAllowance);
  }, [allowances, amount, token, allTokens, chainId]);

  return {
    hasSufficientAllowance,
    allowance,
    readableAllowance,
  };
};

export default useAllowance;
