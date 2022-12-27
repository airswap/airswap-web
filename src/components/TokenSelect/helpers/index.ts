import { TokenInfo } from "@airswap/typescript";

import i18n from "i18next";

export const getTokenText = (
  token: TokenInfo | null,
  readOnly: boolean
): string => {
  if (readOnly && token === null) {
    return "";
  }

  if (token === null) {
    return i18n.t("common.select");
  }

  return token.symbol;
};
