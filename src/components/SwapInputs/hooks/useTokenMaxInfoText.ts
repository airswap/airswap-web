import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ADDRESS_ZERO } from "@airswap/utils";

import { formatUnits } from "ethers/lib/utils";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenSymbol } from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { selectBalances } from "../../../features/balances/balancesSlice";
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
  const { values: balances } = useAppSelector(selectBalances);

  useEffect(() => {
    if (
      tokenInfo &&
      maxAmount &&
      chainId &&
      !swapTransactionCost &&
      !isGasCostLoading
    ) {
      dispatch(getGasPrice({ chainId }));
    }
  }, [tokenInfo, maxAmount]);

  if (!maxAmount || !tokenInfo || !swapTransactionCost) {
    return null;
  }

  const tokenSymbol = getTokenSymbol(tokenInfo);
  const amountAndSymbolText = `${maxAmount} ${tokenSymbol}`;

  if (tokenInfo.address === ADDRESS_ZERO && maxAmount === "0") {
    const nativeTokenBalance = balances[ADDRESS_ZERO];

    return t("orders.nativeCurrencyTooSmallInfoText", {
      balance: formatUnits(nativeTokenBalance || "0", 18),
      fee: swapTransactionCost,
    });
  }

  if (tokenInfo.address === ADDRESS_ZERO) {
    return t("orders.nativeCurrencyMaxInfoText", {
      amount: amountAndSymbolText,
      fee: swapTransactionCost,
    });
  }

  return `Balance: ${amountAndSymbolText}`;
};
