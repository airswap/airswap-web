import { useEffect, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { ADDRESS_ZERO } from "@airswap/constants";
import { selectBalances } from "../features/balances/balancesSlice";
import { selectAllTokenInfo } from "../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../helpers/findEthOrTokenByAddress";
import getWethAddress from "../helpers/getWethAddress";
import stringToSignificantDecimals from "../helpers/stringToSignificantDecimals";

interface DepositNativeTokenAmountInfo {
  nativeTokenSymbol?: string;
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
        ADDRESS_ZERO,
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
      nativeTokenSymbol: nativeTokenSymbol,
      wrappedNativeTokenSymbol,
      ownedWrappedNativeTokenAmount: wrappedNativeTokenBalance,
    };
  };

export default useShouldDepositNativeTokenAmountInfo;
