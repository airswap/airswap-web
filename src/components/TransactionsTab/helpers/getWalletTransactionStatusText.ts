import { TFunction } from "react-i18next";

import { TransactionStatusType } from "../../../types/transactionType";

export default function getWalletTransactionStatusText(
  status: TransactionStatusType,
  t: TFunction
): string {
  switch (status) {
    case TransactionStatusType.succeeded:
      return t("common.success");
    case TransactionStatusType.processing:
      return t("common.processing");
    case TransactionStatusType.expired:
      return t("common.expired");
    case TransactionStatusType.reverted:
      return t("common.failed");
    case TransactionStatusType.declined:
      return t("orders.swapRejected");
    default:
      return t("common.unknown");
  }
}
