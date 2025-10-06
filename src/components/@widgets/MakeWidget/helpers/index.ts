import { BigNumber } from "bignumber.js";
import i18n from "i18next";

import { UserToken } from "../../../../features/userSettings/userSettingsSlice";
import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import { TokenSelectModalTypes } from "../../../../types/tokenSelectModalTypes";

export const getActionButtonTranslation = (
  hasInsufficientAllowance: boolean,
  hasInsufficientBalance: boolean,
  hasInsufficientExpiry: boolean,
  hasMissingMakerAmount: boolean,
  hasMissingMakerToken: boolean,
  hasMissingTakerAmount: boolean,
  hasMissingTakerToken: boolean,
  isLoading: boolean,
  networkIsUnsupported: boolean,
  shouldDepositNativeToken: boolean,
  shouldRefresh: boolean,
  walletIsNotConnected: boolean,
  makerTokenSymbol?: string
): string => {
  if (isLoading) {
    return "";
  }

  if (walletIsNotConnected) {
    return i18n.t("wallet.connectWallet");
  }

  if (networkIsUnsupported) {
    return i18n.t("wallet.switchNetwork");
  }

  if (shouldRefresh) {
    return i18n.t("common.reloadPage");
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
    return i18n.t("orders.insufficientBalance");
  }

  if (shouldDepositNativeToken) {
    return `${i18n.t("common.wrap")} ${makerTokenSymbol}`;
  }

  if (hasInsufficientAllowance) {
    return `${i18n.t("orders.continue")}`;
  }

  return i18n.t("common.review");
};

export const getNewTokenPair = (
  type: TokenSelectModalTypes,
  newToken: UserToken,
  tokenTo?: UserToken,
  tokenFrom?: UserToken
): { tokenFrom?: UserToken; tokenTo?: UserToken } => {
  let newTokenTo = type === "quote" ? newToken : tokenTo;
  let newTokenFrom = type === "base" ? newToken : tokenFrom;

  if (newTokenTo === newTokenFrom && type === "quote") {
    newTokenFrom = tokenTo as UserToken;
  } else if (newTokenTo === newTokenFrom && type === "base") {
    newTokenTo = tokenFrom as UserToken;
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
