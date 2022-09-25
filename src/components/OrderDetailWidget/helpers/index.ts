import { chainNames } from "@airswap/constants";

import i18n from "i18next";

import nativeCurrency from "../../../constants/nativeCurrency";
import { OrderStatus } from "../../../types/orderStatus";

export const getOrderStatus = (
  status: "idle" | "not-found" | "open" | "taken" | "canceled"
) => {
  switch (status) {
    case "taken":
      return OrderStatus.taken;
    case "canceled":
      return OrderStatus.canceled;
    default:
      return OrderStatus.open;
  }
};

export const getFullOrderWarningTranslation = (
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
    return i18n.t("orders.thisOrderWasNotForTheConnectedWallet");
  }

  if (orderIsNotForConnectedWallet && !isExpired) {
    return i18n.t("orders.thisOrderIsNotForTheConnectedWallet");
  }

  return undefined;
};
