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
  const activeTokensCache: {
    [address: string]: {
      [chainId: number]: string[];
    };
  } = {};
  const transactionCache: {
    [address: string]: {
      [chainId: number]: SubmittedTransaction[];
    };
  } = {};

  let currentTransaction: TransactionsState;

  store.subscribe(() => {
    const { wallet, metadata, transactions } = store.getState();
    if (!wallet.connected) return;

    let previousTransaction = currentTransaction;
    currentTransaction = transactions;

    if (previousTransaction !== currentTransaction) {
      // handles change in transactions and persists all transactions to localStorage
      // TODO: don't save all transactions (e.g. max 10 transactions)
      const txs: TransactionsState = JSON.parse(
        localStorage.getItem(
          getTransactionsLocalStorageKey(wallet.address!, wallet.chainId!)
        )!
      ) || { all: [] };

      if (transactionCache[wallet.address!] === undefined) {
        transactionCache[wallet.address!] = {};
        transactionCache[wallet.address!][wallet.chainId!] = txs.all;
      }
      if (
        transactions.all.length &&
        transactionCache[wallet.address!][wallet.chainId!] !== transactions.all
      ) {
        transactionCache[wallet.address!][wallet.chainId!] = transactions.all;
        localStorage.setItem(
          getTransactionsLocalStorageKey(wallet.address!, wallet.chainId!),
          JSON.stringify(transactions)
        );
      }
    }

    if (!activeTokensCache[wallet.address!]) {
      activeTokensCache[wallet.address!] = {};
    }
    const cachedTokensForActiveWallet =
      activeTokensCache[wallet.address!][wallet.chainId!];
    if (
      metadata.tokens.active.length &&
      cachedTokensForActiveWallet !== metadata.tokens.active
    ) {
      // active tokens have changed, persist to local storage.
      activeTokensCache[wallet.address!][wallet.chainId!] =
        metadata.tokens.active;
      localStorage.setItem(
        getActiveTokensLocalStorageKey(wallet.address!, wallet.chainId!),
        metadata.tokens.active.join(",")
      );
    }
  });
};
