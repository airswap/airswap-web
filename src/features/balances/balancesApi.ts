import { BigNumber, ethers } from "ethers";
import { fetchTokens } from "@airswap/metadata";
import { chainIds } from "@airswap/constants";
import { TokenInfo } from "@uniswap/token-lists";
import uniqBy from "lodash.uniqby";

import BalanceChecker from "@airswap/balances/build/contracts/BalanceChecker.json";
import balancesDeploys from "@airswap/balances/deploys.json";

const balancesInterface = new ethers.utils.Interface(
  JSON.stringify(BalanceChecker.abi)
);

const getContract = (
  chainId: keyof typeof balancesDeploys,
  provider: ethers.providers.Web3Provider
) => {
  return new ethers.Contract(
    balancesDeploys[chainId],
    balancesInterface,
    provider
  );
};

export const defaultTokenSets: {
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

export const getSavedTokenSet = (chainId: number) => {
  return (defaultTokenSets[chainId] || []).concat(
    (localStorage.getItem(`airswap/tokenSet/${chainId}`) || "")
      .split(",")
      .filter((address) => address.length)
  );
};

const tokensCache: {
  [chainId: number]: TokenInfo[];
} = {};

export const getAllTokens = async (chainId: number) => {
  let tokens;
  if (tokensCache[chainId]) {
    tokens = tokensCache[chainId];
  } else {
    tokens = tokensCache[chainId] = await fetchTokens(chainId);
  }
  return tokens;
};

export const getSavedTokenSetInfo = async (chainId: number) => {
  const tokens = await getAllTokens(chainId);
  const tokenSet = getSavedTokenSet(chainId);
  const matchingTokens = tokens.filter((tokenInfo) =>
    tokenSet.includes(tokenInfo.address)
  );
  return uniqBy(matchingTokens, (token) => token.address.toLowerCase());
};

/**
 * Fetches balances or allowances for a wallet using the airswap utility
 * contract `BalanceChecker.sol`. Balances are returned in base units.
 */
const fetchBalancesOrAllowances: (
  method: "walletBalances" | "walletAllowances",
  params: {
    chainId: keyof typeof balancesDeploys;
    provider: ethers.providers.Web3Provider;
    walletAddress: string;
    tokenAddresses: string[];
  }
) => Promise<string[]> = async (
  method,
  { chainId, provider, tokenAddresses, walletAddress }
) => {
  const contract = getContract(chainId, provider);
  const balances: BigNumber[] = await contract[method](
    walletAddress,
    tokenAddresses
  );
  return balances.map((balance) => balance.toString());
};

const fetchBalances = fetchBalancesOrAllowances.bind(null, "walletBalances");
const fetchAllowances = fetchBalancesOrAllowances.bind(
  null,
  "walletAllowances"
);

export { fetchBalances, fetchAllowances };
