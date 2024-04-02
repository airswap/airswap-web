import {
  SubmittedApprovalTransaction,
  SubmittedCancellation,
  SubmittedDepositTransaction,
  SubmittedRFQOrder,
  SubmittedTransaction,
  SubmittedTransactionWithOrder,
  SubmittedWithdrawTransaction,
} from "./SubmittedTransaction";

export const isApprovalTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedApprovalTransaction =>
  transaction.type === "Approval";

export const isCancelTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedCancellation => transaction.type === "Cancel";

export const isDepositTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedDepositTransaction => transaction.type === "Deposit";

export const isWithdrawTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedWithdrawTransaction =>
  transaction.type === "Withdraw";

export const isRfqOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedRFQOrder =>
  transaction.type === "Order" &&
  transaction.protocol === "request-for-quote-erc20";

export const isLastLookOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedRFQOrder =>
  transaction.type === "Order" && transaction.protocol === "last-look-erc20";

export const isOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedTransactionWithOrder => {
  return (
    isRfqOrderTransaction(transaction) ||
    isLastLookOrderTransaction(transaction)
  );
};

export const sortSubmittedTransactionsByExpiry = (
  a: SubmittedTransaction,
  b: SubmittedTransaction
) => {
  return b.timestamp - a.timestamp;
};
