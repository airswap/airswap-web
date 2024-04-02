import { AppDispatch, RootState } from "../../app/store";
import { ApproveEvent } from "../../entities/ApproveEvent/ApproveEvent";
import {
  findMatchingApprovalTransaction,
  isApproveEvent,
} from "../../entities/ApproveEvent/ApproveEventHelpers";
import { ExtendedFullSwapERC20 } from "../../entities/ExtendedFullSwapERC20/ExtendedFullSwapERC20";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  isApprovalTransaction,
  isDepositTransaction,
  isWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { WETHEvent } from "../../entities/WETHEvent/WETHEvent";
import {
  findMatchingDepositOrWithdrawTransaction,
  isWETHEvent,
} from "../../entities/WETHEvent/WETHEventHelpers";
import { setTransactions } from "./transactionsSlice";

export const updateTransaction =
  (updatedTransaction: SubmittedTransaction, previousHash?: string) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const transactions = getState().transactions.transactions;
    const transactionIndex = transactions.findIndex(
      (transaction) =>
        transaction.hash === updatedTransaction.hash ||
        transaction.hash === previousHash
    );

    if (transactionIndex === -1) {
      return;
    }

    const updatedTransactions = [...transactions];
    updatedTransactions.splice(transactionIndex, 1, updatedTransaction);

    dispatch(setTransactions(updatedTransactions));
  };

type TransactionEvent = ApproveEvent | ExtendedFullSwapERC20 | WETHEvent;

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
    return (
      transactions
        .filter(isDepositTransaction)
        .find((transaction) =>
          findMatchingDepositOrWithdrawTransaction(transaction, event)
        ) ||
      transactions
        .filter(isWithdrawTransaction)
        .find((transaction) =>
          findMatchingDepositOrWithdrawTransaction(transaction, event)
        )
    );
  }

  return undefined;
};

export const handleTransactionEvent =
  (event: TransactionEvent) =>
  (dispatch: AppDispatch, getState: () => RootState): void => {
    const transactions = getState().transactions.transactions;
    const pendingTransactions = transactions.filter(
      (transaction) => transaction.status === "processing"
    );
    const matchingTransaction = getMatchingTransaction(
      event,
      pendingTransactions
    );

    if (!matchingTransaction) {
      return;
    }

    dispatch(
      updateTransaction(
        {
          ...matchingTransaction,
          hash: event.hash,
          status: event.status === 1 ? "succeeded" : "declined",
        },
        matchingTransaction.hash
      )
    );
  };
