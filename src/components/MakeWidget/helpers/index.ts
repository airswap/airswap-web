import { BigNumber } from "bignumber.js";
import i18n from "i18next";

import { getHumanReadableNumber } from "../../../helpers/getHumanReadableNumber";
import stringToSignificantDecimals from "../../../helpers/stringToSignificantDecimals";
import { TokenSelectModalTypes } from "../../../types/tokenSelectModalTypes";
import { MakeWidgetState } from "../MakeWidget";

export const getActionButtonTranslation = (
  hasInsufficientAllowance: boolean,
  hasInsufficientBalance: boolean,
  hasInsufficientExpiry: boolean,
  hasMissingMakerAmount: boolean,
  hasMissingMakerToken: boolean,
  hasMissingTakerAmount: boolean,
  hasMissingTakerToken: boolean,
  networkIsUnsupported: boolean,
  shouldDepositNativeToken: boolean,
  walletIsNotConnected: boolean,
  widgetState: MakeWidgetState,
  makerTokenSymbol?: string
): string => {
  if (walletIsNotConnected) {
    return i18n.t("wallet.connectWallet");
  }

  if (networkIsUnsupported) {
    return i18n.t("wallet.unsupportedNetwork");
  }

  if (hasInsufficientExpiry) {
    return i18n.t("orders.expiryShouldBeMoreThan0");
  }

  if (hasMissingMakerToken || hasMissingTakerToken) {
    return i18n.t("orders.chooseToken");
  }

  if (hasMissingMakerAmount) {
    return i18n.t("orders.enterAmounts");
  }

  if (hasMissingTakerAmount) {
    return i18n.t("orders.enterAmounts");
  }

  if (hasInsufficientBalance) {
    return i18n.t("orders.insufficientBalance", { symbol: makerTokenSymbol });
  }

  if (widgetState === MakeWidgetState.list) {
    return i18n.t("common.review");
  }

  if (shouldDepositNativeToken) {
    return `${i18n.t("common.wrap")} ${makerTokenSymbol}`;
  }

  if (hasInsufficientAllowance) {
    return `${i18n.t("orders.approve")} ${makerTokenSymbol}`;
  }

  return i18n.t("common.sign");
};

export const getNewTokenPair = (
  type: TokenSelectModalTypes,
  newToken: string,
  tokenTo?: string,
  tokenFrom?: string
): { tokenFrom?: string; tokenTo?: string } => {
  let newTokenTo = type === "quote" ? newToken : tokenTo;
  let newTokenFrom = type === "base" ? newToken : tokenFrom;

  if (newTokenTo === newTokenFrom && type === "quote") {
    newTokenFrom = tokenTo as string;
  } else if (newTokenTo === newTokenFrom && type === "base") {
    newTokenTo = tokenFrom as string;
  }

  return {
    tokenFrom: newTokenFrom,
    tokenTo: newTokenTo,
  };
};

export const getTokenPairTranslation = (
  token1 = "?",
  token1Amount: string,
  token2 = "?",
  token2Amount: string
) => {
  const amount = new BigNumber(token2Amount).dividedBy(
    new BigNumber(token1Amount)
  );
  const readableAmount = stringToSignificantDecimals(amount.toString(), 6);

  return `1 ${token1} = ${readableAmount} ${token2}`;
};
