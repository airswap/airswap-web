import { useEffect, useState } from "react";

import { ADDRESS_ZERO } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

import { useAppSelector } from "../app/hooks";
import { isTokenInfo } from "../entities/AppTokenInfo/AppTokenInfoHelpers";
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

    const { chainId } = useAppSelector((state) => state.web3);

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

      if (
        !wrappedNativeTokenInfo ||
        !nativeTokenInfo ||
        !isTokenInfo(nativeTokenInfo) ||
        !isTokenInfo(wrappedNativeTokenInfo)
      ) {
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
