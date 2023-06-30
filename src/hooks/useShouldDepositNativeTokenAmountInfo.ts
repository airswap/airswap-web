import { useEffect, useState } from "react";

import { WETH } from "@airswap/libraries";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { nativeCurrencyAddress } from "../constants/nativeCurrency";
import { selectBalances } from "../features/balances/balancesSlice";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";
import getWethAddress from "../helpers/getWethAddress";
import stringToSignificantDecimals from "../helpers/stringToSignificantDecimals";

interface DepositNativeTokenAmountInfo {
  nativeToken?: string;
  wrappedNativeTokenSymbol?: string;
  ownedWrappedNativeTokenAmount?: string;
}

const useShouldDepositNativeTokenAmountInfo =
  (): DepositNativeTokenAmountInfo => {
    const allTokens = useAppSelector(selectAllTokenInfo);
    const balances = useAppSelector(selectBalances);

    const { chainId } = useWeb3React<Web3Provider>();

    const [nativeTokenSymbol, setNativeTokenSymbol] = useState("");
    const [wrappedNativeTokenSymbol, setWrappedNativeTokenSymbol] =
      useState("");
    const [wrappedNativeTokenBalance, setWrappedNativeTokenBalance] =
      useState("");

    useEffect(() => {
      if (!chainId || !allTokens.length || !balances.values) {
        return;
      }

      const wrappedTokenAddress = getWethAddress(chainId);

      if (!wrappedTokenAddress) {
        return;
      }

      const nativeTokenInfo = findEthOrTokenByAddress(
        nativeCurrencyAddress,
        allTokens,
        chainId
      );
      const wrappedNativeTokenInfo = findEthOrTokenByAddress(
        wrappedTokenAddress,
        allTokens,
        chainId
      );

      if (!wrappedNativeTokenInfo || !nativeTokenInfo) {
        return;
      }

      const balance = stringToSignificantDecimals(
        new BigNumber(balances.values[wrappedTokenAddress] || 0)
          .div(10 ** wrappedNativeTokenInfo.decimals)
          .toFormat()
      );

      setNativeTokenSymbol(nativeTokenInfo.symbol);
      setWrappedNativeTokenSymbol(wrappedNativeTokenInfo.symbol);
      setWrappedNativeTokenBalance(balance);
    }, [allTokens, chainId, balances]);

    return {
      nativeToken: nativeTokenSymbol,
      wrappedNativeTokenSymbol,
      ownedWrappedNativeTokenAmount: wrappedNativeTokenBalance,
    };
  };

export default useShouldDepositNativeTokenAmountInfo;
