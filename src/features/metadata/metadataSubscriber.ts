import { TokenInfo } from "@airswap/utils";

import { store } from "../../app/store";
import {
  getActiveTokensLocalStorageKey,
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

  store.subscribe(() => {
    const { web3, metadata } = store.getState();

    if (!web3.isActive || !web3.account || !web3.chainId) {
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
