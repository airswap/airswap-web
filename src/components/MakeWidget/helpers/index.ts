import { TFunction } from "i18next";

import { OrderScopeType } from "../../../types/orderTypes";
import { SelectOption } from "../../Dropdown/Dropdown";

export const getOrderTypeSelectOptions = (t: TFunction): SelectOption[] => {
  return [
    {
      value: OrderScopeType.public,
      label: t("orders.anyone"),
    },
    {
      value: OrderScopeType.private,
      label: t("orders.specificWallet"),
    },
  ];
};

export const getActionButtonTranslation = (
  t: TFunction,
  hasInsufficientExpiry: boolean,
  hasInsufficientMakerTokenBalance: boolean,
  hasMissingMakerAmount: boolean,
  hasMissingMakerToken: boolean,
  hasMissingTakerAmount: boolean,
  hasMissingTakerToken: boolean,
  makerTokenSymbol?: string
): string => {
  if (hasInsufficientExpiry) {
    return "Insufficient expiry";
  }

  if (hasMissingMakerAmount || hasMissingTakerAmount) {
    return t("orders.enterAmount");
  }

  if (hasMissingMakerToken || hasMissingTakerToken) {
    return t("orders.chooseToken");
  }

  if (hasInsufficientMakerTokenBalance) {
    return t("orders.insufficentBalance", { symbol: makerTokenSymbol });
  }

  return t("common.sign");
};
