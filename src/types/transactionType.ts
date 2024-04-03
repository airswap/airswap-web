export enum TransactionType {
  approval = "Approval",
  order = "Order",
  deposit = "Deposit",
  withdraw = "Withdraw",
  cancel = "Cancel",
}

export enum TransactionStatusType {
  declined = "declined",
  failed = "failed",
  expired = "expired",
  processing = "processing",
  reverted = "reverted",
  succeeded = "succeeded",
}
