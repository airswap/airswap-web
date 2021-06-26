import { store } from "../../app/store";
import {
  getActiveTokensLocalStorageKey,
  getTransactionsLocalStorageKey,
} from "./metadataApi";
import {
  SubmittedTransaction,
  TransactionsState,
} from "../transactions/transactionsSlice";

export const subscribeToSavedTokenChangesForLocalStoragePersisting = () => {
  const cache: {
    [chainId: number]: string[];
  } = {};
  const transactionCache: {
    [chainId: number]: {
      [address: string]: SubmittedTransaction[];
    };
  } = {};

  let currentTransaction: TransactionsState;

  store.subscribe(() => {
    const { wallet, metadata, transactions } = store.getState();
    if (!wallet.connected) return;

    let previousTransaction = currentTransaction;
    currentTransaction = transactions;

    if (wallet && transactions) {
      if (previousTransaction !== currentTransaction) {
        // handles change in transactions and persists all transactions to localStorage
        // TODO: don't save all transactions (e.g. max 10 transactions)
        const txs: TransactionsState = JSON.parse(
          localStorage.getItem(
            getTransactionsLocalStorageKey(wallet.chainId!, wallet.address!)
          )!
        ) || { all: [] };

        if (transactionCache[wallet.chainId!] === undefined) {
          transactionCache[wallet.chainId!] = {};
          transactionCache[wallet.chainId!][wallet.address!] = txs.all;
        }
        if (
          transactions.all.length &&
          transactionCache[wallet.chainId!][wallet.address!] !==
            transactions.all
        ) {
          transactionCache[wallet.chainId!][wallet.address!] = transactions.all;
          localStorage.setItem(
            getTransactionsLocalStorageKey(wallet.chainId!, wallet.address!),
            JSON.stringify(transactions)
          );
        }
      }
    }

    if (wallet && metadata) {
      // active tokens have changed, persist to local storage.
      const cached = cache[wallet.chainId!];
      if (metadata.tokens.active.length && cached !== metadata.tokens.active) {
        cache[wallet.chainId!] = metadata.tokens.active;
        localStorage.setItem(
          getActiveTokensLocalStorageKey(wallet.chainId!),
          metadata.tokens.active.join(",")
        );
      }
    }
  });
};
