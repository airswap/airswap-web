import i18n from "i18next";

export const getActionButtonTranslation = (
  networkIsUnsupported: boolean,
  walletIsNotConnected: boolean
): string => {
  if (walletIsNotConnected) {
    return i18n.t("wallet.connectWallet");
  }

  if (networkIsUnsupported) {
    return i18n.t("wallet.unsupportedNetwork");
  }

  return i18n.t("orders.makeNewOrder");
};
