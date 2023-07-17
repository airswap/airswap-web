import i18 from "i18next";

export const getWalletButtonText = (
  isConnected: boolean,
  isUnsupportedNetwork: boolean,
  addressOrName: string | null
): string => {
  if (isUnsupportedNetwork) {
    return i18.t("wallet.unsupportedNetwork");
  }

  if (addressOrName && isConnected) {
    return addressOrName;
  }

  return i18.t("wallet.notConnected");
};
