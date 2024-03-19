import {
  SubmittedApproval,
  SubmittedRFQOrder,
  SubmittedTransaction,
} from "./SubmittedTransaction";

export const isApprovalTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedApproval => transaction.type === "Approval";
export const isRfqOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedRFQOrder =>
  transaction.type === "Order" &&
  transaction.protocol === "request-for-quote-erc20";
export const isLastLookOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedRFQOrder =>
  transaction.type === "Order" && transaction.protocol === "last-look-erc20";
