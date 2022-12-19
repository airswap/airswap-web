import { TokenInfo } from "@airswap/typescript";

import { store } from "../../app/store";
import {
  SubmittedTransaction,
  TransactionsState,
} from "../transactions/transactionsSlice";
import {
  getActiveTokensLocalStorageKey,
  getAllTokensLocalStorageKey,
  getCustomTokensLocalStorageKey,
  getTransactionsLocalStorageKey,
} from "./metadataApi";

export const subscribeToSavedTokenChangesForLocalStoragePersisting = () => {
  const activeTokensCache: {
    [address: string]: {
      [chainId: number]: string[];
    };
  } = {};
  const customTokensCache: {
    [address: string]: {
      [chainId: number]: string[];
    };
  } = {};
  const allTokensCache: {
    [chainId: number]: {
      [address: string]: TokenInfo;
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
      // Store only the top 10 transactions
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
        transactionCache[wallet.address!][wallet.chainId!] =
          mostRecentTransactions;
        localStorage.setItem(
          getTransactionsLocalStorageKey(wallet.address!, wallet.chainId!),
          JSON.stringify({
            all: mostRecentTransactions,
          })
        );
      }
    }

    // All tokens

    if (!allTokensCache[wallet.chainId!]) {
      allTokensCache[wallet.chainId!] = {};
    }

    const cachedAllTokensForChain = allTokensCache[wallet.chainId!];

    if (
      Object.values(metadata.tokens.all).length !==
      Object.values(cachedAllTokensForChain).length
    ) {
      // all tokens have changed, persist to local storage.

      allTokensCache[wallet.chainId!] = metadata.tokens.all;
      localStorage.setItem(
        getAllTokensLocalStorageKey(wallet.chainId!),
        JSON.stringify(metadata.tokens.all)
      );
    }

    // Active tokens

    if (!activeTokensCache[wallet.address!]) {
      activeTokensCache[wallet.address!] = {};
    }
    const cachedActiveTokensForActiveWallet =
      activeTokensCache[wallet.address!][wallet.chainId!];
    if (
      metadata.tokens.active.length &&
      cachedActiveTokensForActiveWallet !== metadata.tokens.active
    ) {
      // active tokens have changed, persist to local storage.
      activeTokensCache[wallet.address!][wallet.chainId!] =
        metadata.tokens.active;
      localStorage.setItem(
        getActiveTokensLocalStorageKey(wallet.address!, wallet.chainId!),
        metadata.tokens.active.join(",")
      );
    }

    // Custom tokens

    if (!customTokensCache[wallet.address!]) {
      customTokensCache[wallet.address!] = {};
    }
    const cachedCustomTokensForActiveWallet =
      customTokensCache[wallet.address!][wallet.chainId!];
    if (
      metadata.tokens.custom.length &&
      cachedCustomTokensForActiveWallet !== metadata.tokens.custom
    ) {
      // custom tokens have changed, persist to local storage.
      customTokensCache[wallet.address!][wallet.chainId!] =
        metadata.tokens.custom;
      localStorage.setItem(
        getCustomTokensLocalStorageKey(wallet.address!, wallet.chainId!),
        metadata.tokens.custom.join(",")
      );
    }
  });
};
