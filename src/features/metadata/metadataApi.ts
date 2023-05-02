import { SwapERC20 } from "@airswap/libraries";
import { getKnownTokens, getTokenInfo } from "@airswap/metadata";
import { TokenInfo } from "@airswap/types";
import { Web3Provider } from "@ethersproject/providers";

import * as ethers from "ethers";
import uniqBy from "lodash.uniqby";

import { MetadataTokens } from "./metadataSlice";

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
    tokensCache[chainId] = (await getKnownTokens(chainId)).tokens;
    //TODO: handle failure here, need to decide what to do with errors
  }
  tokens = tokensCache[chainId];
  return tokens;
};

export const getUnknownTokens = async (
  chainId: number,
  supportedTokenAddresses: string[],
  allTokens: TokenInfo[],
  provider: ethers.providers.BaseProvider
): Promise<TokenInfo[]> => {
  // Determine tokens we still don't know about.
  const allTokenAddresses = allTokens.map((token) => token.address);
  const unknownTokens = supportedTokenAddresses.filter(
    (supportedTokenAddr) => !allTokenAddresses.includes(supportedTokenAddr)
  );

  let scrapedTokens: TokenInfo[] = [];
  if (unknownTokens.length) {
    const scrapePromises = unknownTokens.map((t) => getTokenInfo(provider, t));
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

  return scrapedTokens;
};

export const getActiveTokensFromLocalStorage = (
  account: string,
  chainId: number
): MetadataTokens["active"] => {
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
): MetadataTokens["custom"] => {
  const savedTokens = (
    localStorage.getItem(getCustomTokensLocalStorageKey(account, chainId)) || ""
  )
    .split(",")
    .filter((address) => address.length);
  return (savedTokens.length && savedTokens) || [];
};

export const getAllTokensFromLocalStorage = (
  chainId: number
): MetadataTokens["all"] => {
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
  return (
    await SwapERC20.getContract(provider, chainId).protocolFee()
  ).toNumber();
};
