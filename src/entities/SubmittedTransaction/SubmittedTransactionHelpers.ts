import { TransactionTypes } from "../../types/transactionTypes";
import {
  SubmittedApprovalTransaction,
  SubmittedCancellation,
  SubmittedDepositTransaction,
  SubmittedLastLookOrder,
  SubmittedTransaction,
  SubmittedOrder,
  SubmittedWithdrawTransaction,
  SubmittedOrderUnderConsideration,
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

export const isSubmittedOrder = (
  transaction: SubmittedTransaction
): transaction is SubmittedOrder => {
  return transaction.type === TransactionTypes.order && !!transaction.hash;
};

export const isSubmittedOrderUnderConsideration = (
  transaction: SubmittedTransaction
): transaction is SubmittedOrderUnderConsideration => {
  return transaction.type === TransactionTypes.order && !transaction.hash;
};

export const isLastLookOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedLastLookOrder => {
  return (
    isSubmittedOrder(transaction) &&
    !!transaction.hash &&
    !!transaction.isLastLook
  );
};

export const sortSubmittedTransactionsByExpiry = (
  a: SubmittedTransaction,
  b: SubmittedTransaction
) => {
  return b.timestamp - a.timestamp;
};

export const getSubmittedTransactionKey = (
  transaction: SubmittedTransaction
) => {
  if (isSubmittedOrderUnderConsideration(transaction)) {
    return `${transaction.order.signerWallet}-${transaction.order.nonce}-${transaction.timestamp}`;
  }

  return transaction.hash;
};

export const doesTransactionsMatch = (
  transaction: SubmittedTransaction,
  match: SubmittedTransaction,
  hash?: string
): boolean => {
  if (
    isSubmittedOrderUnderConsideration(transaction) &&
    isSubmittedOrderUnderConsideration(match)
  ) {
    return transaction.order.nonce === match.order.nonce;
  }

  return transaction.hash === match.hash || transaction.hash === hash;
};
