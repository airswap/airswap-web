import { fetchTokens, scrapeToken } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import { providers } from "ethers";
import uniqBy from "lodash.uniqby";

const tokensCache: {
  [chainId: number]: Promise<TokenInfo[]>;
} = {};

export const getActiveTokensLocalStorageKey: (
  account: string,
  chainId: number
) => string = (account, chainId) =>
  `airswap/activeTokens/${account}/${chainId}`;

export const getCachedMetadataLocalStorageKey = (chainId: number): string =>
  `airswap/metadataCache/${chainId}`;

export const getAllTokens = async (chainId: number) => {
  let tokens;
  if (!tokensCache[chainId]) {
    tokensCache[chainId] = fetchTokens(chainId);
  }
  // TODO: handle failure.
  tokens = await tokensCache[chainId];
  return tokens;
};

export const getUnknownTokens = async (
  chainId: number,
  supportedTokenAddresses: string[],
  allTokens: TokenInfo[],
  provider: providers.Provider
): Promise<TokenInfo[]> => {
  const storageKey = getCachedMetadataLocalStorageKey(chainId);
  // Get a list of all token addresses from token lists
  const uniqueTokenListAddresses = uniqBy(allTokens, (t) => t.address).map(
    (t) => t.address
  );

  // Get any tokens we've previously manually looked up from cache
  let localStorageTokens: TokenInfo[] = [];
  const localStorageData = localStorage.getItem(storageKey);
  if (localStorageData) {
    try {
      localStorageTokens = (JSON.parse(localStorageData) as TokenInfo[]).filter(
        // This filter ensures we don't continue to store tokens that become
        // unsupported or contained in token lists.
        (t) =>
          !uniqueTokenListAddresses.includes(t.address) &&
          supportedTokenAddresses.includes(t.address)
      );
    } catch (e) {
      localStorage.removeItem(storageKey);
    }
  }

  const localStorageTokenAddresses = localStorageTokens.map((t) => t.address);
  const knownTokens = uniqueTokenListAddresses.concat(
    localStorageTokenAddresses
  );

  // Determine tokens we still don't know about.
  const unknownTokens = supportedTokenAddresses.filter(
    (supportedTokenAddr) => !knownTokens.includes(supportedTokenAddr)
  );

  let scrapedTokens: TokenInfo[] = [];
  if (unknownTokens.length) {
    // @ts-ignore provider type mismatch w/ metadata repo
    const scrapePromises = unknownTokens.map((t) => scrapeToken(t, provider));
    const results = await Promise.allSettled(scrapePromises);
    scrapedTokens = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => {
        const tokenInfo = (r as PromiseFulfilledResult<TokenInfo>).value;
        return {
          ...tokenInfo,
          address: tokenInfo.address.toLowerCase(),
        };
      });
  }

  localStorageTokens = localStorageTokens.concat(scrapedTokens);
  localStorage.setItem(storageKey, JSON.stringify(localStorageTokens));

  return localStorageTokens;
};

export const getActiveTokensFromLocalStorage = (
  account: string,
  chainId: number
) => {
  const savedTokens = (
    localStorage.getItem(getActiveTokensLocalStorageKey(account, chainId)) || ""
  )
    .split(",")
    .filter((address) => address.length);
  return (savedTokens.length && savedTokens) || [];
};

export const getSavedActiveTokensInfo = async (
  account: string,
  chainId: number
) => {
  const tokens = await getAllTokens(chainId);
  const activeTokens = getActiveTokensFromLocalStorage(account, chainId);
  const matchingTokens = tokens.filter((tokenInfo) =>
    activeTokens.includes(tokenInfo.address)
  );
  return uniqBy(matchingTokens, (token) => token.address);
};

export const getTransactionsLocalStorageKey: (
  walletAddress: string,
  chainId: number
) => string = (walletAddress, chainId) =>
  `airswap/transactions/${walletAddress}/${chainId}`;
