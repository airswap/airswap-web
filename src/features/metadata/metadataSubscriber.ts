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
import { MetadataState } from "./metadataSlice";

interface TokensCache {
  [address: string]: {
    [chainId: number]: string[];
  };
}

interface AllTokensCache {
  [chainId: number]: {
    [address: string]: TokenInfo;
  };
}

const compareAndWriteTokensToLocalStorage = (
  tokensCache: TokensCache,
  metadata: MetadataState,
  address: string,
  chainId: number,
  localStorageKey: string
) => {
  if (!tokensCache[address]) {
    tokensCache[address] = {};
  }
  const cachedActiveTokensForActiveWallet = tokensCache[address][chainId];
  if (
    metadata.tokens.active.length &&
    cachedActiveTokensForActiveWallet !== metadata.tokens.active
  ) {
    // active tokens have changed, persist to local storage.
    tokensCache[address][chainId] = metadata.tokens.active;
    localStorage.setItem(localStorageKey, metadata.tokens.active.join(","));
  }
};

export const subscribeToSavedTokenChangesForLocalStoragePersisting = () => {
  const activeTokensCache: TokensCache = {};
  const customTokensCache: TokensCache = {};
  const allTokensCache: AllTokensCache = {};
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

    if (!wallet.address || !wallet.chainId) {
      return;
    }

    // Active tokens
    compareAndWriteTokensToLocalStorage(
      activeTokensCache,
      metadata,
      wallet.address,
      wallet.chainId,
      getActiveTokensLocalStorageKey(wallet.address, wallet.chainId)
    );

    // Custom tokens
    compareAndWriteTokensToLocalStorage(
      customTokensCache,
      metadata,
      wallet.address,
      wallet.chainId,
      getCustomTokensLocalStorageKey(wallet.address, wallet.chainId)
    );
  });
};
