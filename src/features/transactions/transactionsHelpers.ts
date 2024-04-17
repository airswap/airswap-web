import { TransactionReceipt } from "@ethersproject/providers";

import { AppDispatch, RootState } from "../../app/store";
import {
  findMatchingApprovalTransaction,
  isApproveEvent,
} from "../../entities/ApproveEvent/ApproveEventHelpers";
import {
  findMatchingCancelTransaction,
  isCancelEvent,
} from "../../entities/CancelEvent/CancelEventHelpers";
import {
  findMatchingOrderTransaction,
  isFullSwapERC20Event,
} from "../../entities/FullSwapERC20Event/FullSwapERC20EventHelpers";
import {
  SubmittedDepositTransaction,
  SubmittedOrder,
  SubmittedOrderUnderConsideration,
  SubmittedTransaction,
  SubmittedWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  doTransactionsMatch,
  isApprovalTransaction,
  isCancelTransaction,
  isDepositTransaction,
  isSubmittedOrder,
  isSubmittedOrderUnderConsideration,
  isWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import {
  findMatchingDepositOrWithdrawTransaction,
  isWETHEvent,
} from "../../entities/WETHEvent/WETHEventHelpers";
import {
  TransactionEvent,
  TransactionStatusType,
} from "../../types/transactionTypes";
import { WethEventType } from "../../types/wethEventType";
import {
  handleApproveTransaction,
  handleSubmittedCancelOrder,
  handleSubmittedDepositOrder,
  handleSubmittedOrder,
  handleSubmittedWithdrawOrder,
} from "../orders/ordersActions";
import { setTransactions } from "./transactionsSlice";

export const updateTransaction =
  (updatedTransaction: SubmittedTransaction, previousHash?: string) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const transactions = getState().transactions.transactions;
    const transactionIndex = transactions.findIndex((transaction) =>
      doTransactionsMatch(transaction, updatedTransaction, previousHash)
    );

    if (transactionIndex === -1) {
      return;
    }

    const updatedTransactions = [...transactions];
    updatedTransactions.splice(transactionIndex, 1, updatedTransaction);

    dispatch(setTransactions(updatedTransactions));
  };

const getMatchingTransaction = (
  event: TransactionEvent,
  transactions: SubmittedTransaction[]
): SubmittedTransaction | undefined => {
  if (isApproveEvent(event)) {
    return transactions
      .filter(isApprovalTransaction)
      .find((transaction) =>
        findMatchingApprovalTransaction(transaction, event)
      );
  }

  if (isWETHEvent(event)) {
    return transactions
      .filter(
        event.type === WethEventType.deposit
          ? isDepositTransaction
          : isWithdrawTransaction
      )
      .find((transaction) =>
        findMatchingDepositOrWithdrawTransaction(
          transaction as
            | SubmittedWithdrawTransaction
            | SubmittedDepositTransaction,
          event
        )
      );
  }

  if (isFullSwapERC20Event(event)) {
    const orderUnderConsiderationTransactions = transactions.filter(
      isSubmittedOrderUnderConsideration
    );
    const orderTransactions = transactions.filter(isSubmittedOrder);

    return [...orderTransactions, ...orderUnderConsiderationTransactions].find(
      (transaction) => findMatchingOrderTransaction(transaction, event)
    );
  }

  if (isCancelEvent(event)) {
    return transactions
      .filter(isCancelTransaction)
      .find((transaction) => findMatchingCancelTransaction(transaction, event));
  }

  return undefined;
};

export const handleTransactionEvent =
  (event: TransactionEvent) =>
  (dispatch: AppDispatch, getState: () => RootState): void => {
    const transactions = getState().transactions.transactions;
    const pendingTransactions = transactions.filter(
      (transaction) => transaction.status === TransactionStatusType.processing
    );
    const matchingTransaction = getMatchingTransaction(
      event,
      pendingTransactions
    );

    if (!matchingTransaction) {
      return;
    }

    let updatedTransaction: SubmittedTransaction = {
      ...matchingTransaction,
      hash: event.hash,
      status:
        event.status === 1
          ? TransactionStatusType.succeeded
          : TransactionStatusType.declined,
    };

    if (isFullSwapERC20Event(event) && isSubmittedOrder(updatedTransaction)) {
      updatedTransaction.swap = event.swap;
    }

    dispatch(updateTransaction(updatedTransaction, matchingTransaction.hash));
  };

export const handleTransactionResolved =
  (transaction: SubmittedTransaction) =>
  (dispatch: AppDispatch): void => {
    if (isApprovalTransaction(transaction)) {
      handleApproveTransaction(transaction, transaction.status, dispatch);
    }

    if (isDepositTransaction(transaction)) {
      handleSubmittedDepositOrder(transaction, transaction.status, dispatch);
    }

    if (isWithdrawTransaction(transaction)) {
      handleSubmittedWithdrawOrder(transaction, transaction.status, dispatch);
    }

    if (isSubmittedOrder(transaction)) {
      handleSubmittedOrder(transaction, transaction.status);
    }

    if (isCancelTransaction(transaction)) {
      handleSubmittedCancelOrder(transaction.status);
    }
  };

export const updateTransactionWithReceipt =
  (transaction: SubmittedTransaction, receipt: TransactionReceipt) =>
  (dispatch: AppDispatch): void => {
    if (receipt?.status === undefined) {
      return;
    }

    const status =
      receipt.status === 1
        ? TransactionStatusType.succeeded
        : TransactionStatusType.failed;

    dispatch(
      updateTransaction({
        ...transaction,
        status,
      })
    );
  };
