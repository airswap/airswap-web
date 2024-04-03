import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { sortSubmittedTransactionsByExpiry } from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { getUniqueArrayChildren } from "../../helpers/array";
import { TransactionStatusType } from "../../types/transactionType";
import useHistoricalTransactions from "./hooks/useHistoricalTransactions";
import useLatestApproveFromEvents from "./hooks/useLatestApproveFromEvents";
import useLatestDepositOrWithdrawFromEvents from "./hooks/useLatestDepositOrWithdrawFromEvents";
import useLatestSucceededTransaction from "./hooks/useLatestSucceededTransaction";
import useLatestSwapFromEvents from "./hooks/useLatestSwapFromEvents";
import { updateTransactionWithReceipt } from "./transactionsActions";
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

  const [activeListenerHashes, setActiveListenerHashes] = useState<string[]>(
    []
  );
  const [historicalTransactions] = useHistoricalTransactions(chainId, account);
  const latestSwap = useLatestSwapFromEvents(chainId, account);
  const latestApprove = useLatestApproveFromEvents(chainId, account);
  const latestDepositOrWithdraw = useLatestDepositOrWithdrawFromEvents(
    chainId,
    account
  );
  const latestSuccessfulTransaction = useLatestSucceededTransaction();

  useEffect(() => {
    if (!account || !chainId || !library) {
      return;
    }

    setLocalStorageTransactions(account, chainId, transactions);

    const listenForTransactionReceipt = async (
      transaction: SubmittedTransaction
    ) => {
      const receipt = await getTransactionReceipt(transaction, library);

      if (receipt) {
        dispatch(updateTransactionWithReceipt(transaction, receipt));
      }
    };

    const newProcessingTransactions = transactions.filter(
      (transaction) =>
        transaction.status === TransactionStatusType.processing &&
        transaction.hash &&
        !activeListenerHashes.includes(transaction.hash)
    );

    newProcessingTransactions.forEach(listenForTransactionReceipt);

    const newListenerHashes = newProcessingTransactions
      .map((transaction) => transaction.hash)
      .filter(Boolean) as string[];

    setActiveListenerHashes([...activeListenerHashes, ...newListenerHashes]);
  }, [transactions]);

  useEffect(() => {
    if (!account || !chainId) {
      return;
    }

    dispatch(setTransactions(getLocalStorageTransactions(account, chainId)));
  }, [account, chainId]);

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

  useEffect(() => {
    if (latestSwap) {
      dispatch(handleTransactionEvent(latestSwap));
    }
  }, [latestSwap]);

  useEffect(() => {
    if (latestApprove) {
      dispatch(handleTransactionEvent(latestApprove));
    }
  }, [latestApprove]);

  useEffect(() => {
    if (latestDepositOrWithdraw) {
      dispatch(handleTransactionEvent(latestDepositOrWithdraw));
    }
  }, [latestDepositOrWithdraw]);

  useEffect(() => {
    if (latestSuccessfulTransaction) {
      console.log(latestSuccessfulTransaction);

      dispatch(handleTransactionResolved(latestSuccessfulTransaction));
    }
  }, [latestSuccessfulTransaction]);
};
