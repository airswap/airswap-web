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
  networkIsUnsupported: boolean,
  takerAddressIsInvalid: boolean,
  walletIsNotConnected: boolean,
  makerTokenSymbol?: string,
  takerTokenSymbol?: string
): string => {
  if (walletIsNotConnected) {
    return t("wallet.connectWallet");
  }

  if (networkIsUnsupported) {
    return t("wallet.unsupportedNetwork");
  }

  if (hasInsufficientExpiry) {
    return t("orders.expiryShouldBeMoreThan0");
  }

  if (hasMissingMakerToken || hasMissingTakerToken) {
    return t("orders.chooseToken");
  }

  if (hasMissingMakerAmount) {
    return t("orders.enterTokenAmount", { symbol: makerTokenSymbol });
  }

  if (hasMissingTakerAmount) {
    return t("orders.enterTokenAmount", { symbol: takerTokenSymbol });
  }

  if (hasInsufficientMakerTokenBalance) {
    return t("orders.insufficentBalance", { symbol: makerTokenSymbol });
  }

  if (takerAddressIsInvalid) {
    return t("orders.enterValidTakerAddress");
  }

  return t("common.sign");
};
