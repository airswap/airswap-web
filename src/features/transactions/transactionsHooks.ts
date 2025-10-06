import { useEffect } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { notifyOrderExpiry } from "../../components/Toasts/ToastController";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { sortSubmittedTransactionsByExpiry } from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { getUniqueArrayChildren } from "../../helpers/array";
import { TransactionStatusType } from "../../types/transactionTypes";
import useHistoricalTransactions from "./hooks/useHistoricalTransactions";
import useLatestExpiredTransaction from "./hooks/useLatestExpiredTransaction";
import useLatestSucceededTransaction from "./hooks/useLatestSucceededTransaction";
import useLatestTransactionEvent from "./hooks/useLatestTransactionEvent";
import useTransactionsFilterFromLocalStorage from "./hooks/useTransactionsFilterFromLocalStorage";
import {
  updateTransaction,
  updateTransactionWithReceipt,
} from "./transactionsHelpers";
import {
  handleTransactionResolved,
  handleTransactionEvent,
} from "./transactionsHelpers";
import {
  selectTransactions,
  setIsInitialized,
  setTransactions,
} from "./transactionsSlice";
import {
  getLocalStorageTransactions,
  getTransactionReceipt,
  setLocalStorageTransactions,
} from "./transactionsUtils";

export const useTransactions = (): void => {
  const dispatch = useAppDispatch();

  const { provider: library } = useWeb3React();
  const { account, chainId } = useAppSelector((state) => state.web3);
  const transactions: SubmittedTransaction[] =
    useAppSelector(selectTransactions);

  const [historicalTransactions] = useHistoricalTransactions();
  const latestTransactionEvent = useLatestTransactionEvent();
  const latestSuccessfulTransaction = useLatestSucceededTransaction();
  const latestExpiredTransaction = useLatestExpiredTransaction();
  useTransactionsFilterFromLocalStorage();

  // When the transactions change, we want to save them to local storage.
  useEffect(() => {
    if (!account || !chainId || !library) {
      return;
    }

    setLocalStorageTransactions(account, chainId, transactions);
  }, [transactions]);

  // When the account or chainId changes, we want to load the transactions from local storage and update the store.
  // If there were any processing transactions, we want to try to get the receipt for them.
  useEffect(() => {
    if (!account || !chainId || !library) {
      return;
    }

    const localStorageTransactions = getLocalStorageTransactions(
      account,
      chainId
    );

    const getTransactionReceiptAndUpdateTransaction = async (
      transaction: SubmittedTransaction
    ) => {
      const receipt = await getTransactionReceipt(transaction, library);

      if (receipt) {
        dispatch(updateTransactionWithReceipt(transaction, receipt));
      }
    };

    const processingTransactions = localStorageTransactions.filter(
      (transaction) =>
        transaction.status === TransactionStatusType.processing ||
        transaction.status === TransactionStatusType.expired
    );

    processingTransactions.forEach(getTransactionReceiptAndUpdateTransaction);

    dispatch(setTransactions(localStorageTransactions));
    dispatch(setIsInitialized(true));
  }, [account, chainId]);

  // Historical transactions are loaded from the contract logs and merged into the transaction store if needed.
  useEffect(() => {
    if (!historicalTransactions) {
      return;
    }

    if (
      historicalTransactions.chainId === chainId &&
      historicalTransactions.account === account
    ) {
      const updatedTransactions = [
        ...historicalTransactions.transactions,
        ...transactions,
      ];
      // Remove duplicates, in favour of store transactions.
      const uniqueTransactions = getUniqueArrayChildren<SubmittedTransaction>(
        updatedTransactions,
        "hash"
      );
      const sortedTransactions = uniqueTransactions.sort(
        sortSubmittedTransactionsByExpiry
      );

      dispatch(setTransactions(sortedTransactions));
    }
  }, [historicalTransactions]);

  // If any transaction event is detected like a swap, approve, wrap, unwrap, we want to handle it here.
  useEffect(() => {
    if (latestTransactionEvent) {
      dispatch(handleTransactionEvent(latestTransactionEvent));
    }
  }, [latestTransactionEvent]);

  // If a transaction was not taken in time then it should be expired.
  useEffect(() => {
    if (latestExpiredTransaction) {
      dispatch(
        updateTransaction({
          ...latestExpiredTransaction,
          status: TransactionStatusType.expired,
        })
      );
      notifyOrderExpiry();
    }
  }, [latestExpiredTransaction]);

  // If a transaction is successful, we want to handle it here.
  useEffect(() => {
    if (latestSuccessfulTransaction) {
      handleTransactionResolved(latestSuccessfulTransaction, dispatch);
    }
  }, [latestSuccessfulTransaction]);
};
