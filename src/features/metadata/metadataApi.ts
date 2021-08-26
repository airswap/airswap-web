import { fetchTokens } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import uniqBy from "lodash.uniqby";

const tokensCache: {
  [chainId: number]: Promise<TokenInfo[]>;
} = {};

export const getActiveTokensLocalStorageKey: (
  account: string,
  chainId: number
) => string = (account, chainId) =>
  `airswap/activeTokens/${account}/${chainId}`;

export const getAllTokens = async (chainId: number) => {
  let tokens;
  if (!tokensCache[chainId]) {
    tokensCache[chainId] = fetchTokens(chainId);
  }
  // TODO: handle failure.
  tokens = await tokensCache[chainId];
  return tokens;
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
