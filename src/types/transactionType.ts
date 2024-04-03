export enum TransactionType {
  approval = "approval",
  order = "order",
  deposit = "deposit",
  withdraw = "withdraw",
  cancel = "cancel",
}

export enum TransactionStatusType {
  declined = "declined",
  failed = "failed",
  expired = "expired",
  processing = "processing",
  reverted = "reverted",
  succeeded = "succeeded",
}
