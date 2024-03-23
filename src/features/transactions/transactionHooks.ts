import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { selectAllTokenInfo } from "../metadata/metadataSlice";
import {
  getTransactionsLocalStorageKey,
  listenForTransactionReceipt,
} from "./transactionUtils";
import { selectTransactions, setTransactions } from "./transactionsSlice";

export const useTransactions = (): void => {
  const dispatch = useAppDispatch();

  const { account, library, chainId } = useWeb3React();
  const tokens = useAppSelector(selectAllTokenInfo);
  const transactions: SubmittedTransaction[] =
    useAppSelector(selectTransactions);

  const [activeListenerHashes, setActiveListenerHashes] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (!account || !chainId || !library || !tokens.length) {
      return;
    }

    // const localStorageKey = getTransactionsLocalStorageKey(account, chainId);
    // localStorage.setItem(localStorageKey, JSON.stringify(transactions));

    console.log(transactions);
    console.log(tokens);

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
  }, [transactions, tokens]);

  useEffect(() => {
    if (!account || !chainId) {
      return;
    }

    // dispatch(setTransactions(getLocalStorageTransactions(account, chainId)));
  }, [account, chainId]);
};
