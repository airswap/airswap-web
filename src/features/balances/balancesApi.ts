import { BigNumber, ethers, EventFilter, Event } from "ethers";

import BalanceChecker from "@airswap/balances/build/contracts/BalanceChecker.json";
import balancesDeploys from "@airswap/balances/deploys.js";
import { Light } from "@airswap/protocols";
import erc20Abi from "erc-20-abi";
import { hexZeroPad, id } from "ethers/lib/utils";

const balancesInterface = new ethers.utils.Interface(
  JSON.stringify(BalanceChecker.abi)
);

const erc20Interface = new ethers.utils.Interface(erc20Abi);

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
  activeTokenAddresses: string[];
  walletAddress: string;
  provider: ethers.providers.Web3Provider;
  onBalanceChange: (
    tokenAddress: string,
    amount: BigNumber,
    direction: "in" | "out"
  ) => void;
}) => () => void = ({
  activeTokenAddresses,
  walletAddress,
  provider,
  onBalanceChange,
}) => {
  // event Transfer(address indexed _from, address indexed _to, uint256 _value)
  const filters: {
    in: EventFilter;
    out: EventFilter;
  } = {
    // Tokens being transferred out of our account
    out: {
      topics: [
        id("Transfer(address,address,uint256)"), // event name
        hexZeroPad(walletAddress, 32), // from
      ],
    },

    // Tokens being transferred in to our account
    in: {
      topics: [
        id("Transfer(address,address,uint256)"), // event name
        [],
        hexZeroPad(walletAddress, 32), // to
      ],
    },
  };

  const tearDowns: (() => void)[] = [];
  Object.keys(filters).forEach((direction) => {
    const typedDirection = direction as keyof typeof filters;
    const filter = filters[typedDirection];
    function listener(event: Event) {
      const { address } = event;
      const lowerCasedAddress = address.toLowerCase();
      if (!activeTokenAddresses.includes(lowerCasedAddress)) return;

      const parsedEvent = erc20Interface.parseLog(event);
      const amount: BigNumber = parsedEvent.args[2];
      onBalanceChange(lowerCasedAddress, amount, typedDirection);
    }
    provider.on(filter, listener);
    tearDowns.push(provider.off.bind(provider, filter, listener));
  });

  return () => {
    tearDowns.forEach((fn) => fn());
  };
};

const subscribeToApprovals: (params: {
  tokenAddresses: string[];
  walletAddress: string;
  spenderAddress: string;
  provider: ethers.providers.Web3Provider;
  onApproval: (tokenAddress: string, amount: BigNumber) => void;
}) => () => void = ({
  tokenAddresses,
  walletAddress,
  spenderAddress,
  provider,
  onApproval,
}) => {
  const filter: EventFilter = {
    topics: [
      id("Approval(address,address,uint256)"), // event name
      hexZeroPad(walletAddress, 32), // owner
      hexZeroPad(spenderAddress, 32), // spender
    ],
  };

  // event Approval(address indexed _owner, address indexed _spender, uint256 _value)
  const listener = (event: Event) => {
    const { address } = event;
    const lowerCasedAddress = address.toLowerCase();
    if (!tokenAddresses.includes(lowerCasedAddress)) return;
    const parsedEvent = erc20Interface.parseLog(event);
    const amount: BigNumber = parsedEvent.args[2];
    onApproval(lowerCasedAddress, amount);
  };

  provider.on(filter, listener);

  // return a teardown function.
  return provider.off.bind(provider, filter, listener);
};

export {
  fetchBalances,
  fetchAllowances,
  subscribeToTransfers,
  subscribeToApprovals,
};
