import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { sortSubmittedTransactionsByExpiry } from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { getUniqueArrayChildren } from "../../helpers/array";
import useHistoricalTransactions from "./hooks/useHistoricalTransactions";
import { selectTransactions, setTransactions } from "./transactionsSlice";
import {
  getLocalStorageTransactions,
  listenForTransactionReceipt,
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
  const [historicalTransactions] = useHistoricalTransactions(
    chainId,
    account || undefined
  );

  useEffect(() => {
    if (!account || !chainId || !library) {
      return;
    }

    setLocalStorageTransactions(account, chainId, transactions);

    const newListenerHashes = transactions
      .filter(
        (transaction) =>
          transaction.status === "processing" &&
          transaction.hash &&
          !activeListenerHashes.includes(transaction.hash)
      )
      .map((transaction) => {
        listenForTransactionReceipt(transaction, library, dispatch);

        return transaction.hash;
      })
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
};
