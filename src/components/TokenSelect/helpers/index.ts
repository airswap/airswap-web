import { TokenInfo } from "@airswap/typescript";

import i18n from "i18next";

import { isTokenInfo } from "../../../entities/TokenInfo/TokenInfoHelpers";
import { UnknownToken } from "../../../entities/UnknownToken/UnknownToken";

export const getTokenText = (
  token: TokenInfo | UnknownToken | null,
  readOnly: boolean
): string => {
  if (readOnly && token === null) {
    return "";
  }

  if (token === null) {
    return i18n.t("common.select");
  }

  if (isTokenInfo(token)) {
    return token.symbol;
  }

  return "Unknown token · Please Connect";
};
