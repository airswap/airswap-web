import { TFunction } from "react-i18next";

import { TokenInfo } from "@airswap/typescript";

import {
  nativeCurrencyAddress,
  nativeCurrencySafeTransactionFee,
} from "../../../constants/nativeCurrency";
import { isTokenInfo } from "../../../entities/TokenInfo/TokenInfoHelpers";
import { UnknownToken } from "../../../entities/UnknownToken/UnknownToken";

export default function getTokenMaxInfoText(
  tokenInfo: TokenInfo | UnknownToken | null,
  maxAmount: string | null,
  t: TFunction<"translation">
): string | null {
  if (!maxAmount || !tokenInfo || !isTokenInfo(tokenInfo)) {
    return null;
  }

  const transactionFee =
    tokenInfo.address === nativeCurrencyAddress &&
    nativeCurrencySafeTransactionFee[tokenInfo.chainId];
  const amountAndSymbolText = `${maxAmount} ${tokenInfo.symbol}`;

  if (transactionFee) {
    return t("orders.nativeCurrencyMaxInfoText", {
      amount: amountAndSymbolText,
      fee: transactionFee,
    });
  }

  return `Balance: ${amountAndSymbolText}`;
}
