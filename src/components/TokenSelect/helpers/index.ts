import i18n from "i18next";

import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import { getTokenSymbol } from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";

export const getTokenText = (
  token: AppTokenInfo | null,
  readOnly: boolean
): string => {
  if (readOnly && token === null) {
    return "";
  }

  if (!token) {
    return i18n.t("common.select");
  }

  return getTokenSymbol(token);
};
