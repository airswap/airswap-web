import { useEffect, useState } from "react";

import { TokenInfo } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { nativeCurrencyAddress } from "../constants/nativeCurrency";
import { selectAllowances } from "../features/balances/balancesSlice";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";
import getWethAddress from "../helpers/getWethAddress";

const useAllowance = (
  token: TokenInfo | null,
  amount?: string
): {
  hasSufficientAllowance: boolean;
  allowance: string;
  readableAllowance: string;
} => {
  const { chainId } = useWeb3React<Web3Provider>();
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

    // ETH can't have allowance because it's not a token. So we default to WETH.
    const justifiedAddress =
      token.address === nativeCurrencyAddress
        ? getWethAddress(chainId)
        : token.address;

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
