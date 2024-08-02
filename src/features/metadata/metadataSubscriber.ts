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
    const { web3, metadata, transactions } = store.getState();
    if (!web3.isActive) return;

    // All tokens
    if (!allTokensCache[web3.chainId!]) {
      allTokensCache[web3.chainId!] = {};
    }

    const cachedAllTokensForChain = allTokensCache[web3.chainId!];

    if (
      Object.values(metadata.tokens.all).length !==
      Object.values(cachedAllTokensForChain).length
    ) {
      // all tokens have changed, persist to local storage.

      allTokensCache[web3.chainId!] = metadata.tokens.all;
      localStorage.setItem(
        getAllTokensLocalStorageKey(web3.chainId!),
        JSON.stringify(metadata.tokens.all)
      );
    }

    if (!web3.account || !web3.chainId) {
      return;
    }

    // Active tokens
    compareAndWriteTokensToLocalStorage(
      activeTokensCache,
      metadata.tokens.active,
      web3.account,
      web3.chainId,
      getActiveTokensLocalStorageKey(web3.account, web3.chainId)
    );

    // Custom tokens
    compareAndWriteTokensToLocalStorage(
      customTokensCache,
      metadata.tokens.custom,
      web3.account,
      web3.chainId,
      getCustomTokensLocalStorageKey(web3.account, web3.chainId)
    );
  });
};
