import { SwapERC20, Wrapper, BatchCall } from "@airswap/libraries";

import erc20Abi from "erc-20-abi";
import { BigNumber, ethers, EventFilter, Event } from "ethers";
import { hexZeroPad, id } from "ethers/lib/utils";

interface WalletParams {
  chainId: number;
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  tokenAddresses: string[];
}

/**
 * Fetches balances or allowances for a wallet using the airswap utility
 * contract `BalanceChecker.sol`. Balances are returned in base units.
 */
const fetchBalancesOrAllowances: (
  method: "walletBalances" | "walletAllowances",
  spenderAddressType: "Wrapper" | "Swap" | "None",
  params: WalletParams
) => Promise<string[]> = async (
  method,
  spenderAddressType,
  { chainId, provider, tokenAddresses, walletAddress }
) => {
  const contract = BatchCall.getContract(provider, chainId);
  const args =
    method === "walletBalances"
      ? [walletAddress, tokenAddresses]
      : spenderAddressType === "Swap"
      ? // sender, spender, tokens.
        [walletAddress, SwapERC20.getAddress(chainId), tokenAddresses]
      : [walletAddress, Wrapper.getAddress(chainId), tokenAddresses];
  const amounts: BigNumber[] = await contract[method].apply(null, args);
  return amounts.map((amount) => amount.toString());
};

const fetchBalances = fetchBalancesOrAllowances.bind(
  null,
  "walletBalances",
  "None"
);
const fetchAllowancesSwap = fetchBalancesOrAllowances.bind(
  null,
  "walletAllowances",
  "Swap"
);
const fetchAllowancesWrapper = fetchBalancesOrAllowances.bind(
  null,
  "walletAllowances",
  "Wrapper"
);

export { fetchBalances, fetchAllowancesSwap, fetchAllowancesWrapper };
