import { BigNumber, ethers } from "ethers";
import { fetchTokens } from "@airswap/metadata";
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

const defaultTokenSet = ["WETH", "USDT", "USDC", "DAI", "AST"];

export const getSavedTokenSet = (chainId: number) => {
  return defaultTokenSet.concat(
    (localStorage.getItem(`airswap/tokenSet/${chainId}`) || "")
      .split(",")
      .filter((symbol) => symbol.length)
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
    tokenSet.includes(tokenInfo.symbol)
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
