import { BigNumber, ethers } from "ethers";

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
