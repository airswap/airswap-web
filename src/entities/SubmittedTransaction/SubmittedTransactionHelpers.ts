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

export const isOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedTransactionWithOrder => {
  return transaction.type === TransactionTypes.order;
};

export const isLastLookOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedLastLookOrder => {
  return isOrderTransaction(transaction) && !!transaction.isLastLook;
};

export const sortSubmittedTransactionsByExpiry = (
  a: SubmittedTransaction,
  b: SubmittedTransaction
) => {
  return b.timestamp - a.timestamp;
};
