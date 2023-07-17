import { useMemo } from "react";

import { WETH } from "@airswap/libraries";
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

const useSufficientAllowance = (
  token: TokenInfo | null,
  amount?: string
): boolean => {
  const { chainId } = useWeb3React<Web3Provider>();
  const allTokens = useAppSelector(selectAllTokenInfo);
  const allowances = useAppSelector(selectAllowances);

  return useMemo(() => {
    if (!token || !amount || !chainId) {
      return false;
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
      return false;
    }

    const tokenAllowance = allowances.swap.values[justifiedToken.address];

    if (!tokenAllowance) {
      // safer to return true here (has allowance) as validator will catch the
      // missing allowance, so the user won't swap, and they won't pay
      // unnecessary gas for an approval they may not need.
      return true;
    }

    return new BigNumber(tokenAllowance)
      .div(10 ** justifiedToken.decimals)
      .gte(amount);
  }, [allowances, amount, token, allTokens, chainId]);
};

export default useSufficientAllowance;
