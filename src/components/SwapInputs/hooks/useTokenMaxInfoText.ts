import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ADDRESS_ZERO } from "@airswap/utils";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenSymbol } from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { getGasPrice } from "../../../features/gasCost/gasCostApi";

type UseTokenMaxInfoTextProps = {
  tokenInfo: AppTokenInfo | null;
  maxAmount: string | null;
};

export const useTokenMaxInfoText = ({
  tokenInfo,
  maxAmount,
}: UseTokenMaxInfoTextProps) => {
  const { t } = useTranslation();
  const { chainId } = useAppSelector((state) => state.web3);
  const dispatch = useAppDispatch();
  const { swapTransactionCost, isLoading: isGasCostLoading } = useAppSelector(
    (state) => state.gasCost
  );

  useEffect(() => {
    if (
      tokenInfo &&
      maxAmount &&
      chainId &&
      !swapTransactionCost &&
      !isGasCostLoading
    ) {
      dispatch(getGasPrice({ chainId: 1 }));
    }
  }, [tokenInfo, maxAmount]);

  if (!maxAmount || !tokenInfo || !swapTransactionCost) {
    return null;
  }

  const tokenSymbol = getTokenSymbol(tokenInfo);
  const amountAndSymbolText = `${maxAmount} ${tokenSymbol}`;

  if (tokenInfo.address === ADDRESS_ZERO) {
    return t("orders.nativeCurrencyMaxInfoText", {
      amount: amountAndSymbolText,
      fee: swapTransactionCost,
    });
  }

  return `Balance: ${amountAndSymbolText}`;
};
