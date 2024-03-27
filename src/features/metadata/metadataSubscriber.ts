import { TokenInfo } from "@airswap/utils";

import { store } from "../../app/store";
import {
  getActiveTokensLocalStorageKey,
  getAllTokensLocalStorageKey,
  getCustomTokensLocalStorageKey,
} from "./metadataApi";

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
  tokens: string[],
  address: string,
  chainId: number,
  localStorageKey: string
) => {
  if (!tokensCache[address]) {
    tokensCache[address] = {};
  }
  const cachedActiveTokensForActiveWallet = tokensCache[address][chainId];
  if (tokens.length && cachedActiveTokensForActiveWallet !== tokens) {
    // active tokens have changed, persist to local storage.
    tokensCache[address][chainId] = tokens;
    localStorage.setItem(localStorageKey, tokens.join(","));
  }
};

export const subscribeToSavedTokenChangesForLocalStoragePersisting = () => {
  const activeTokensCache: TokensCache = {};
  const customTokensCache: TokensCache = {};
  const allTokensCache: AllTokensCache = {};

  store.subscribe(() => {
    const { wallet, metadata, transactions } = store.getState();
    if (!wallet.connected) return;

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
      metadata.tokens.active,
      wallet.address,
      wallet.chainId,
      getActiveTokensLocalStorageKey(wallet.address, wallet.chainId)
    );

    // Custom tokens
    compareAndWriteTokensToLocalStorage(
      customTokensCache,
      metadata.tokens.custom,
      wallet.address,
      wallet.chainId,
      getCustomTokensLocalStorageKey(wallet.address, wallet.chainId)
    );
  });
};
