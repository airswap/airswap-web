import { store } from "../../app/store";
import {
  getActiveTokensLocalStorageKey,
  getCustomTokensLocalStorageKey,
  getUnknownTokensLocalStorageKey,
} from "./metadataApi";
import { MetadataTokenInfoMap } from "./metadataSlice";

interface TokensCache {
  [address: string]: {
    [chainId: number]: string[];
  };
}

interface UnknownTokensCache {
  [chainId: number]: MetadataTokenInfoMap;
}

const compareAndWriteUserTokensToLocalStorage = (
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

const compareAndWriteUnknownTokensToLocalStorage = (
  unknownTokensCache: UnknownTokensCache,
  tokens: MetadataTokenInfoMap,
  chainId: number,
  localStorageKey: string
) => {
  if (!unknownTokensCache[chainId]) {
    unknownTokensCache[chainId] = {};
  }

  const cachedUnknownTokensForChain = unknownTokensCache[chainId];
  if (Object.keys(tokens).length && cachedUnknownTokensForChain !== tokens) {
    // unknown tokens have changed, persist to local storage.
    unknownTokensCache[chainId] = tokens;
    localStorage.setItem(localStorageKey, JSON.stringify(tokens));
  }
};

export const subscribeToSavedTokenChangesForLocalStoragePersisting = () => {
  const activeTokensCache: TokensCache = {};
  const customTokensCache: TokensCache = {};
  const unknownTokensCache: UnknownTokensCache = {};

  store.subscribe(() => {
    const { web3, metadata } = store.getState();

    if (!web3.isActive || !web3.account || !web3.chainId) {
      return;
    }

    // Unknown tokenInfo
    compareAndWriteUnknownTokensToLocalStorage(
      unknownTokensCache,
      metadata.unknownTokens,
      web3.chainId,
      getUnknownTokensLocalStorageKey(web3.chainId)
    );

    // Active tokens
    compareAndWriteUserTokensToLocalStorage(
      activeTokensCache,
      metadata.tokens.active,
      web3.account,
      web3.chainId,
      getActiveTokensLocalStorageKey(web3.account, web3.chainId)
    );

    // Custom tokens
    compareAndWriteUserTokensToLocalStorage(
      customTokensCache,
      metadata.tokens.custom,
      web3.account,
      web3.chainId,
      getCustomTokensLocalStorageKey(web3.account, web3.chainId)
    );
  });
};
