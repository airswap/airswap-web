import { TFunction } from "react-i18next";

import { TokenInfo } from "@airswap/types";
import { ADDRESS_ZERO } from "@airswap/constants";

import {
  nativeCurrencySafeTransactionFee,
} from "../../../constants/nativeCurrency";

export default function getTokenMaxInfoText(
  tokenInfo: TokenInfo | null,
  maxAmount: string | null,
  t: TFunction<"translation">
): string | null {
  if (!maxAmount || !tokenInfo) {
    return null;
  }

  const transactionFee =
    tokenInfo.address === ADDRESS_ZERO &&
    nativeCurrencySafeTransactionFee[tokenInfo.chainId];
  const amountAndSymbolText = `${maxAmount} ${tokenInfo?.symbol}`;

  if (transactionFee) {
    return t("orders.nativeCurrencyMaxInfoText", {
      amount: amountAndSymbolText,
      fee: transactionFee,
    });
  }

  return `Balance: ${amountAndSymbolText}`;
}
