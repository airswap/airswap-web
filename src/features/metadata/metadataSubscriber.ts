import { store } from "../../app/store";
import {
  SubmittedTransaction,
  TransactionsState,
} from "../transactions/transactionsSlice";
import {
  getActiveTokensLocalStorageKey,
  getTransactionsLocalStorageKey,
} from "./metadataApi";

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

  let currentChainId: number;
  let currentTransaction: TransactionsState;

  store.subscribe(() => {
    const { wallet, metadata, transactions } = store.getState();
    if (!wallet.connected) return;

    let previousChainId = currentChainId;
    currentChainId = wallet.chainId!;

    let previousTransaction = currentTransaction;
    currentTransaction = transactions;

    if (
      previousTransaction !== currentTransaction ||
      previousChainId !== currentChainId
    ) {
      // handles change in transactions and persists all transactions to localStorage
      // Store only the top 3 transactions
      const txs: TransactionsState = JSON.parse(
        localStorage.getItem(
          getTransactionsLocalStorageKey(wallet.address!, wallet.chainId!)
        )!
      ) || { all: [] };

      const mostRecentTransactions = transactions.all;

      if (transactionCache[wallet.address!] === undefined) {
        transactionCache[wallet.address!] = {};
        transactionCache[wallet.address!][wallet.chainId!] = txs.all.slice(
          0,
          10
        );
      }
      if (
        previousChainId === currentChainId &&
        transactions.all.length &&
        transactionCache[wallet.address!][wallet.chainId!] !== transactions.all
      ) {
        transactionCache[wallet.address!][
          wallet.chainId!
        ] = mostRecentTransactions;
        localStorage.setItem(
          getTransactionsLocalStorageKey(wallet.address!, wallet.chainId!),
          JSON.stringify({
            all: mostRecentTransactions,
          })
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
