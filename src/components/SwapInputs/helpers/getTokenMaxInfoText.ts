import { TFunction } from "react-i18next";

import { ADDRESS_ZERO } from "@airswap/utils";

import { nativeCurrencySafeTransactionFee } from "../../../constants/nativeCurrency";
import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenSymbol } from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";

export default function getTokenMaxInfoText(
  tokenInfo: AppTokenInfo | null,
  maxAmount: string | null,
  t: TFunction<"translation">
): string | null {
  if (!maxAmount || !tokenInfo) {
    return null;
  }

  const tokenSymbol = getTokenSymbol(tokenInfo);
  const transactionFee =
    tokenInfo.address === ADDRESS_ZERO &&
    nativeCurrencySafeTransactionFee[tokenInfo.chainId];
  const amountAndSymbolText = `${maxAmount} ${tokenSymbol}`;

  if (transactionFee) {
    return t("orders.nativeCurrencyMaxInfoText", {
      amount: amountAndSymbolText,
      fee: transactionFee,
    });
  }

  return `Balance: ${amountAndSymbolText}`;
}
