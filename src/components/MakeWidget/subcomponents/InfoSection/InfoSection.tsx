import React, { FC, useMemo, useState } from "react";

import { wrappedTokenAddresses } from "@airswap/constants";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { BigNumber } from "bignumber.js";
import i18n from "i18next";

import { useAppSelector } from "../../../../app/hooks";
import { nativeCurrencyAddress } from "../../../../constants/nativeCurrency";
import { selectBalances } from "../../../../features/balances/balancesSlice";
import { selectAllTokenInfo } from "../../../../features/metadata/metadataSlice";
import findEthOrTokenByAddress from "../../../../helpers/findEthOrTokenByAddress";
import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import { InfoSubHeading } from "../../../Typography/Typography";
import { Container } from "./InfoSection.styles";

type ActionButtonsProps = {
  shouldDepositNativeTokenAmount?: string;
  className?: string;
};

const InfoSection: FC<ActionButtonsProps> = ({
  shouldDepositNativeTokenAmount,
  className,
}) => {
  const allTokens = useAppSelector(selectAllTokenInfo);
  const balances = useAppSelector(selectBalances);

  const { chainId } = useWeb3React<Web3Provider>();

  const [nativeTokenSymbol, setNativeTokenSymbol] = useState("");
  const [wrappedNativeTokenSymbol, setWrappedNativeTokenSymbol] = useState("");
  const [wrappedNativeTokenBalance, setWrappedNativeTokenBalance] =
    useState("");

  useMemo(() => {
    if (!chainId || !allTokens.length || !balances.values) {
      return undefined;
    }

    const wrappedTokenAddress = wrappedTokenAddresses[chainId];

    if (!wrappedTokenAddress) {
      return undefined;
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

    if (!wrappedNativeTokenInfo) {
      return undefined;
    }

    const balance = stringToSignificantDecimals(
      new BigNumber(balances.values[wrappedTokenAddress] || 0)
        .div(10 ** wrappedNativeTokenInfo.decimals)
        .toFormat()
    );

    setNativeTokenSymbol(nativeTokenInfo.symbol);
    setWrappedNativeTokenSymbol(wrappedNativeTokenInfo.symbol);
    setWrappedNativeTokenBalance(balance);
  }, [allTokens, chainId, balances.values]);

  const text = useMemo(() => {
    if (
      shouldDepositNativeTokenAmount &&
      nativeTokenSymbol &&
      wrappedNativeTokenSymbol &&
      wrappedNativeTokenBalance
    ) {
      return i18n.t("orders.shouldDepositNativeTokenAmount", {
        nativeToken: nativeTokenSymbol,
        wrappedNativeToken: wrappedNativeTokenSymbol,
        ownedWrappedNativeTokenAmount: wrappedNativeTokenBalance,
        shouldGetWrappedNativeTokenAmount: shouldDepositNativeTokenAmount,
      });
    }
  }, [
    shouldDepositNativeTokenAmount,
    nativeTokenSymbol,
    wrappedNativeTokenSymbol,
    wrappedNativeTokenBalance,
  ]);

  if (!text) {
    return null;
  }

  return (
    <Container className={className}>
      <InfoSubHeading>{text}</InfoSubHeading>
    </Container>
  );
};

export default InfoSection;
