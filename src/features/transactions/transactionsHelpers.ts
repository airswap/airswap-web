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
  findMatchingDelegateSetRuleTransaction,
  findMatchingDelegatedSwapTransaction,
  findMatchingUnsetRuleTransaction,
  isDelegateSetRuleEvent,
  isDelegatedSwapEvent,
  isUnsetRuleEvent,
} from "../../entities/DelegateRule/DelegateRuleHelpers";
import {
  findMatchingOrderTransaction,
  isFullSwapERC20Event,
} from "../../entities/FullSwapERC20Event/FullSwapERC20EventHelpers";
import {
  SubmittedDepositTransaction,
  SubmittedOrder,
  SubmittedOrderUnderConsideration,
  SubmittedSetRuleTransaction,
  SubmittedTransaction,
  SubmittedWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  doTransactionsMatch,
  isApprovalTransaction,
  isCancelTransaction,
  isDelegatedSwapTransaction,
  isDepositTransaction,
  isSetRuleTransaction,
  isSubmittedOrder,
  isSubmittedOrderUnderConsideration,
  isUnsetRuleTransaction,
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
  handleSubmittedSetRuleOrder,
  handleSubmittedUnsetRuleOrder,
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

  if (isDelegateSetRuleEvent(event)) {
    return transactions
      .filter(isSetRuleTransaction)
      .find((transaction) =>
        findMatchingDelegateSetRuleTransaction(transaction, event)
      );
  }

  if (isUnsetRuleEvent(event)) {
    return transactions
      .filter(isUnsetRuleTransaction)
      .find((transaction) =>
        findMatchingUnsetRuleTransaction(transaction, event)
      );
  }

  if (isDelegatedSwapEvent(event)) {
    return transactions
      .filter(isDelegatedSwapTransaction)
      .find((transaction) =>
        findMatchingDelegatedSwapTransaction(transaction, event)
      );
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

    const updatedTransaction: SubmittedTransaction = {
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

export const handleTransactionResolved = (
  transaction: SubmittedTransaction,
  dispatch: AppDispatch
) => {
  if (isApprovalTransaction(transaction)) {
    handleApproveTransaction(transaction.status);
  }

  if (isDepositTransaction(transaction)) {
    handleSubmittedDepositOrder(transaction.status);
  }

  if (isWithdrawTransaction(transaction)) {
    handleSubmittedWithdrawOrder(transaction.status);
  }

  if (isSubmittedOrder(transaction)) {
    handleSubmittedOrder(transaction.status);
  }

  if (isCancelTransaction(transaction)) {
    handleSubmittedCancelOrder(transaction.status);
  }

  if (isSetRuleTransaction(transaction)) {
    handleSubmittedSetRuleOrder(transaction, dispatch);
  }

  if (isUnsetRuleTransaction(transaction)) {
    handleSubmittedUnsetRuleOrder(transaction, dispatch);
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
