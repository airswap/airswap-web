import { store } from "../../app/store";
import {
  getActiveTokensLocalStorageKey,
  getTransactionsLocalStorageKey } from "./metadataApi";
import { SubmittedTransaction } from '../transactions/transactionsSlice';


export const subscribeToSavedTokenChangesForLocalStoragePersisting = () => {
  const cache: {
    [chainId: number]: string[];
  } = {};
  const transactionCache: {
    [chainId: number]: SubmittedTransaction[];
  } = {}
  store.subscribe(() => {
    const { wallet, metadata, transactions } = store.getState();
    if (!wallet.connected) return;
    // persist all transactions to localStorage
    const transactionCached = transactionCache[wallet.chainId!];
    if (transactions.all.length && transactionCached !== transactions.all) {
      localStorage.setItem(
        getTransactionsLocalStorageKey(wallet.chainId!),
        JSON.stringify(transactions)
      );
    }

    // active tokens have changed, persist to local storage.
    const cached = cache[wallet.chainId!];
    if (metadata.tokens.active.length && cached !== metadata.tokens.active) {
      cache[wallet.chainId!] = metadata.tokens.active;
      localStorage.setItem(
        getActiveTokensLocalStorageKey(wallet.chainId!),
        metadata.tokens.active.join(",")
      );
    }
  });
};
