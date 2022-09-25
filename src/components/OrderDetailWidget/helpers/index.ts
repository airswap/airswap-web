import i18n from "i18next";

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
  isExpired: boolean,
  isIntendedRecipient: boolean,
  isMakerOfSwap: boolean,
  isNotConnected: boolean
): string | undefined => {
  const orderIsNotForConnectedWallet =
    !isIntendedRecipient && !isMakerOfSwap && !isNotConnected;

  if (orderIsNotForConnectedWallet && isExpired) {
    return i18n.t("orders.thisSwapWasNotForTheConnectedWallet");
  }

  if (orderIsNotForConnectedWallet && !isExpired) {
    return i18n.t("orders.thisSwapIsNotForTheConnectedWallet");
  }

  return undefined;
};
