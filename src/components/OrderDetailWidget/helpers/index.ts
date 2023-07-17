import { chainNames } from "@airswap/constants";

import i18n from "i18next";

export const getFullOrderERC20WarningTranslation = (
  isDifferentChainId: boolean,
  isExpired: boolean,
  isIntendedRecipient: boolean,
  isMakerOfSwap: boolean,
  isNotConnected: boolean,
  orderChainId: number
): string | undefined => {
  const orderIsNotForConnectedWallet =
    !isIntendedRecipient && !isMakerOfSwap && !isNotConnected;

  if (isDifferentChainId) {
    const chainName = chainNames[orderChainId] || i18n.t("common.unknown");
    return i18n.t("orders.thisOrderIsForAnotherChain", { chainName });
  }

  if (orderIsNotForConnectedWallet && isExpired) {
    return i18n.t("orders.thisOrderWasForADifferentTaker");
  }

  if (orderIsNotForConnectedWallet && !isExpired) {
    return i18n.t("orders.thisOrderIsForADifferentTaker");
  }

  return undefined;
};
