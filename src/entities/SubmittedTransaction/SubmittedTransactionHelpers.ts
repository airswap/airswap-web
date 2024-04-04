import { TransactionTypes } from "../../types/transactionTypes";
import {
  SubmittedApprovalTransaction,
  SubmittedCancellation,
  SubmittedDepositTransaction,
  SubmittedLastLookOrder,
  SubmittedRFQOrder,
  SubmittedTransaction,
  SubmittedTransactionWithOrder,
  SubmittedWithdrawTransaction,
} from "./SubmittedTransaction";

export const isApprovalTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedApprovalTransaction =>
  transaction.type === TransactionTypes.approval;

export const isCancelTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedCancellation =>
  transaction.type === TransactionTypes.cancel;

export const isDepositTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedDepositTransaction =>
  transaction.type === TransactionTypes.deposit;

export const isWithdrawTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedWithdrawTransaction =>
  transaction.type === TransactionTypes.withdraw;

export const isRfqOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedRFQOrder =>
  transaction.type === TransactionTypes.order &&
  transaction.protocol === "request-for-quote-erc20";

export const isLastLookOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedLastLookOrder =>
  transaction.type === TransactionTypes.order &&
  transaction.protocol === "last-look-erc20";

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
