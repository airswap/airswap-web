import { chainIds } from "@airswap/constants";
import { fetchTokens } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";
import uniqBy from "lodash.uniqby";

export const defaultActiveTokenss: {
  [chainId: number]: string[];
} = {
  [chainIds.MAINNET]: [
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
    "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
    "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
    "0x27054b13b1b798b345b591a4d22e6562d47ea75a", // AST
  ],
  [chainIds.RINKEBY]: [
    "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea", // DAI
    "0xc778417e063141139fce010982780140aa0cd5ab", // WETH
  ],
};

const tokensCache: {
  [chainId: number]: Promise<TokenInfo[]>;
} = {};

export const getLocalStorageKey: (chainId: number) => string = (chainId) =>
  `airswap/activeTokens/${chainId}`;

export const getAllTokens = async (chainId: number) => {
  let tokens;
  if (!tokensCache[chainId]) {
    tokensCache[chainId] = fetchTokens(chainId);
  }
  // TODO: handle failure.
  tokens = await tokensCache[chainId];
  return tokens;
};

export const getSavedActiveTokens = (chainId: number) => {
  return (defaultActiveTokenss[chainId] || []).concat(
    (localStorage.getItem(getLocalStorageKey(chainId)) || "")
      .split(",")
      .filter((address) => address.length)
  );
};

export const getSavedActiveTokensInfo = async (chainId: number) => {
  const tokens = await getAllTokens(chainId);
  const activeTokens = getSavedActiveTokens(chainId);
  const matchingTokens = tokens.filter((tokenInfo) =>
    activeTokens.includes(tokenInfo.address)
  );
  return uniqBy(matchingTokens, (token) => token.address);
};
