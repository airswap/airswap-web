import { SwapERC20 } from "@airswap/libraries";
import { fetchTokens, scrapeToken } from "@airswap/metadata";
import { TokenInfo } from "@airswap/typescript";
import { Web3Provider } from "@ethersproject/providers";

import { providers } from "ethers";
import uniqBy from "lodash.uniqby";

const tokensCache: {
  [chainId: number]: TokenInfo[];
} = {};

export const getActiveTokensLocalStorageKey: (
  account: string,
  chainId: number
) => string = (account, chainId) =>
  `airswap/activeTokens/${account}/${chainId}`;

export const getCustomTokensLocalStorageKey: (
  account: string,
  chainId: number
) => string = (account, chainId) =>
  `airswap/customTokens/${account}/${chainId}`;

export const getAllTokensLocalStorageKey = (chainId: number): string =>
  `airswap/metadataCache/${chainId}`;

export const getAllTokens = async (chainId: number) => {
  let tokens;
  if (!tokensCache[chainId]) {
    tokensCache[chainId] = (await fetchTokens(chainId)).tokens;
    //TODO: handle failure here, need to decide what to do with errors
  }
  tokens = tokensCache[chainId];
  return tokens;
};

export const getUnknownTokens = async (
  chainId: number,
  supportedTokenAddresses: string[],
  allTokens: TokenInfo[],
  provider: providers.Provider
): Promise<TokenInfo[]> => {
  const storageKey = getAllTokensLocalStorageKey(chainId);
  // Get a list of all token addresses from token lists
  const uniqueTokenListAddresses = uniqBy(allTokens, (t) => t.address).map(
    (t) => t.address
  );

  // Get any tokens we've previously manually looked up from cache
  let localStorageTokens: TokenInfo[] = [];
  const localStorageData = localStorage.getItem(storageKey);
  if (localStorageData) {
    try {
      const localStorageTokensObject = JSON.parse(localStorageData) as {
        [address: string]: TokenInfo;
      };

      localStorageTokens = Object.values(localStorageTokensObject).filter(
        (t) => {
          // This filter ensures we don't continue to store tokens that become
          // unsupported or contained in token lists.
          return (
            !uniqueTokenListAddresses.includes(t.address) &&
            supportedTokenAddresses.includes(t.address)
          );
        }
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

export const getCustomTokensFromLocalStorage = (
  account: string,
  chainId: number
) => {
  const savedTokens = (
    localStorage.getItem(getCustomTokensLocalStorageKey(account, chainId)) || ""
  )
    .split(",")
    .filter((address) => address.length);
  return (savedTokens.length && savedTokens) || [];
};

export const getAllTokensFromLocalStorage = (chainId: number) => {
  const localStorageItem = localStorage.getItem(
    getAllTokensLocalStorageKey(chainId)
  );
  return localStorageItem ? JSON.parse(localStorageItem) : {};
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

export const getProtocolFee = async (
  chainId: number,
  provider: Web3Provider
): Promise<number> => {
  const protocolFee = await new SwapERC20(
    chainId,
    provider.getSigner()
  ).contract.protocolFee();
  return protocolFee.toNumber();
};
