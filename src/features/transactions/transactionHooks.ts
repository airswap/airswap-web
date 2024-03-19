import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  getTransactionsLocalStorageKey,
  listenForTransactionReceipt,
} from "./transactionUtils";
import { selectTransactions, setTransactions } from "./transactionsSlice";

export const useTransactions = (): void => {
  const dispatch = useAppDispatch();

  const { account, library, chainId } = useWeb3React();
  const transactions: SubmittedTransaction[] =
    useAppSelector(selectTransactions);

  const [activeListenerHashes, setActiveListenerHashes] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (!account || !chainId || !library) {
      return;
    }

    const localStorageKey = getTransactionsLocalStorageKey(account, chainId);
    localStorage.setItem(localStorageKey, JSON.stringify(transactions));

    const newListenerHashes = transactions
      .filter(
        (transaction) =>
          transaction.status !== "processing" &&
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

    // dispatch(setTransactions(getLocalStorageTransactions(account, chainId)));
  }, [account, chainId]);
};
