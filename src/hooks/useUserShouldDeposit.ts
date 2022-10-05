import { useMemo } from "react";

import { wrappedTokenAddresses } from "@airswap/constants";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import {
  nativeCurrencyAddress,
  nativeCurrencySafeTransactionFee,
} from "../constants/nativeCurrency";
import { selectBalances } from "../features/balances/balancesSlice";
import { selectActiveTokens } from "../features/metadata/metadataSlice";
import { selectUserTokens } from "../features/userSettings/userSettingsSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";

const useUserShouldDeposit = (tokenAmount: string): boolean => {
  const activeTokens = useAppSelector(selectActiveTokens);
  const balances = useAppSelector(selectBalances);
  const userTokens = useAppSelector(selectUserTokens);

  const { chainId } = useWeb3React<Web3Provider>();
  const { tokenFrom } = userTokens;

  return useMemo(() => {
    if (!tokenFrom || !tokenAmount || !chainId) {
      return false;
    }

    if (tokenFrom !== nativeCurrencyAddress) {
      return false;
    }

    const wrappedTokenAddress = wrappedTokenAddresses[chainId];

    if (!wrappedTokenAddress) {
      return false;
    }

    const nativeTokenAmount = balances.values[nativeCurrencyAddress];
    const wrappedTokenAmount = balances.values[wrappedTokenAddress];

    if (!nativeTokenAmount || !wrappedTokenAmount) {
      return false;
    }

    const nativeTokenInfo = findEthOrTokenByAddress(
      nativeCurrencyAddress,
      activeTokens,
      chainId
    );
    const wrappedTokenInfo = findEthOrTokenByAddress(
      wrappedTokenAddress,
      activeTokens,
      chainId
    );
    const nativeTokenBigNumber = new BigNumber(nativeTokenAmount).div(
      10 ** nativeTokenInfo.decimals
    );
    const wrappedTokenBigNumber = new BigNumber(wrappedTokenAmount).div(
      10 ** wrappedTokenInfo.decimals
    );
    const totalBigNumber = nativeTokenBigNumber
      .plus(wrappedTokenBigNumber)
      .minus(nativeCurrencySafeTransactionFee[chainId] || 0);

    // If user has the required WETH amount then it's not necessary to wrap: we'll just use the WETH
    if (wrappedTokenBigNumber.isGreaterThanOrEqualTo(tokenAmount)) {
      return false;
    }

    // If the ETH and WETH amount is not sufficient then wrapping ETH will not help
    if (totalBigNumber.isLessThan(tokenAmount)) {
      return false;
    }

    // Else it means WETH is not enough, but with wrapping extra ETH it will.
    return true;
  }, [activeTokens, balances.values, tokenFrom, tokenAmount, chainId]);
};

export default useUserShouldDeposit;
