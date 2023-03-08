import { TokenInfo } from "@airswap/types";

import i18n from "i18next";

export const getTokenText = (
  token: TokenInfo | null,
  readOnly: boolean
): string => {
  if (readOnly && token === null) {
    return "";
  }

  if (!token) {
    return i18n.t("common.select");
  }

  return token.symbol;
};
