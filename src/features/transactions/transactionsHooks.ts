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
  updateExpiredTransaction,
  updateTransaction,
  updateTransactionWithReceipt,
} from "./transactionsHelpers";
import {
  handleTransactionResolved,
  handleTransactionEvent,
} from "./transactionsHelpers";
import { selectTransactions, setTransactions } from "./transactionsSlice";
import {
  getLocalStorageTransactions,
  getTransactionReceipt,
  setLocalStorageTransactions,
} from "./transactionsUtils";

export const useTransactions = (): void => {
  const dispatch = useAppDispatch();

  const { chainId, account, library } = useWeb3React();
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
    console.log(transactions);
    setLocalStorageTransactions(account, chainId, transactions);
  }, [transactions]);

  // When the account or chainId changes, we want to load the transactions from local storage and update the store.
  // If there were any processing transactions, we want to try to get the receipt for them.
  useEffect(() => {
    if (!account || !chainId) {
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
      (transaction) => transaction.status === TransactionStatusType.processing
    );

    processingTransactions.forEach(getTransactionReceiptAndUpdateTransaction);

    console.log(localStorageTransactions);

    dispatch(setTransactions(localStorageTransactions));
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
        // TODO: LastLook orders could not have a hash, so we need to add an id prop
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

  // If a LastLook transaction was not taken in time after it was sent for consideration then it should be expired.
  useEffect(() => {
    if (latestExpiredTransaction) {
      dispatch(
        updateExpiredTransaction({
          ...latestExpiredTransaction,
          status: TransactionStatusType.expired,
        })
      );
      notifyOrderExpiry(latestExpiredTransaction);
    }
  }, [latestExpiredTransaction]);

  // If a transaction is successful, we want to handle it here.
  useEffect(() => {
    if (latestSuccessfulTransaction) {
      dispatch(handleTransactionResolved(latestSuccessfulTransaction));
    }
  }, [latestSuccessfulTransaction]);
};
