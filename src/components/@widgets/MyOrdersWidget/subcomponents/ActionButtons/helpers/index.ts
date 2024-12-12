import i18n from "i18next";

export const getActionButtonTranslation = (
  walletIsNotConnected: boolean
): string => {
  if (walletIsNotConnected) {
    return i18n.t("wallet.connectWallet");
  }

  return i18n.t("orders.makeAnOrder");
};
