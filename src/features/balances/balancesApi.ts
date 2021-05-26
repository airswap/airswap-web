import { BigNumber, ethers } from "ethers";

import BalanceChecker from "@airswap/balances/build/contracts/BalanceChecker.json";
import balancesDeploys from "@airswap/balances/deploys.js";
import { Light } from "@airswap/protocols";
import erc20Abi from "erc-20-abi";

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
    chainId: number;
    provider: ethers.providers.Web3Provider;
    walletAddress: string;
    tokenAddresses: string[];
  }
) => Promise<string[]> = async (
  method,
  { chainId, provider, tokenAddresses, walletAddress }
) => {
  const contract = getContract(chainId, provider);
  const args =
    method === "walletBalances"
      ? [walletAddress, tokenAddresses]
      : // sender, spender, tokens.
        [walletAddress, Light.getAddress(chainId), tokenAddresses];
  const amounts: BigNumber[] = await contract[method].apply(null, args);
  return amounts.map((amount) => amount.toString());
};

const fetchBalances = fetchBalancesOrAllowances.bind(null, "walletBalances");
const fetchAllowances = fetchBalancesOrAllowances.bind(
  null,
  "walletAllowances"
);

// event Transfer(address indexed _from, address indexed _to, uint256 _value)
const subscribeToTransfers: (params: {
  tokenAddress: string;
  walletAddress: string;
  provider: ethers.providers.Web3Provider;
  onBalanceChange: (amount: BigNumber, direction: "in" | "out") => void;
}) => () => void = ({
  tokenAddress,
  walletAddress,
  provider,
  onBalanceChange,
}) => {
  const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
  // event Transfer(address indexed _from, address indexed _to, uint256 _value)

  const listener = (from: string, to: string, value: BigNumber) => {
    if (from === walletAddress) {
      onBalanceChange(value, "out");
    } else if (to === walletAddress) {
      onBalanceChange(value, "in");
    }
  };

  contract.on("Transfer", listener);
  return () => {
    contract.off("Transfer", listener);
  };
};

const subscribeToApprovals: (params: {
  tokenAddress: string;
  walletAddress: string;
  spenderAddress: string;
  provider: ethers.providers.Web3Provider;
  onApproval: (amount: BigNumber) => void;
}) => () => void = ({
  tokenAddress,
  walletAddress,
  spenderAddress,
  provider,
  onApproval,
}) => {
  const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);

  // event Approval(address indexed _owner, address indexed _spender, uint256 _value)
  const listener = (owner: string, spender: string, value: BigNumber) => {
    if (
      owner.toLowerCase() === walletAddress.toLowerCase() &&
      spender.toLowerCase() === spenderAddress.toLowerCase()
    ) {
      onApproval(value);
    }
  };

  contract.once("Approval", listener);
  return () => {
    contract.off("Approval", listener);
  };
};

export {
  fetchBalances,
  fetchAllowances,
  subscribeToTransfers,
  subscribeToApprovals,
};
