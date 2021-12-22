import { TFunction } from "react-i18next";

import { StatusType } from "../../../features/transactions/transactionsSlice";

export default function getWalletTransactionStatusText(
  status: StatusType,
  t: TFunction
): string {
  switch (status) {
    case "succeeded":
      return t("common.success");
    case "processing":
      return t("common.processing");
    case "expired":
      return t("common.expired");
    case "reverted":
      return t("common.failed");
    case "declined":
      return t("orders.swapRejected");
    default:
      return t("common.unknown");
  }
}
