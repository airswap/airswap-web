import { chainNames } from "@airswap/utils";

import i18n from "i18next";

interface FullOrderErc20WarningTranslation {
  heading: string;
  subHeading?: string;
}

export const getOrderDetailWarningTranslation = (
  isAllowancesFailed: boolean,
  isDifferentChainId: boolean,
  isExpired: boolean,
  isIntendedRecipient: boolean,
  isMakerOfSwap: boolean,
  isNotConnected: boolean,
  orderChainId: number
): FullOrderErc20WarningTranslation | undefined => {
  const orderIsNotForConnectedWallet =
    !isIntendedRecipient && !isMakerOfSwap && !isNotConnected;

  if (isAllowancesFailed) {
    return {
      heading: i18n.t("balances.failedToFetchAllowances"),
    };
  }

  if (isDifferentChainId) {
    const chainName = chainNames[orderChainId] || i18n.t("common.unknown");
    return {
      heading: i18n.t("orders.thisOrderIsForAnotherChain", { chainName }),
    };
  }

  if (orderIsNotForConnectedWallet && isExpired) {
    return {
      heading: i18n.t("orders.thisOrderWasForADifferentTaker"),
    };
  }

  if (orderIsNotForConnectedWallet && !isExpired) {
    return {
      heading: i18n.t("orders.thisOrderIsForADifferentTaker"),
    };
  }

  return undefined;
};
