import { BigNumber, ethers, EventFilter, Event } from "ethers";

import BalanceChecker from "@airswap/balances/build/contracts/BalanceChecker.json";
import balancesDeploys from "@airswap/balances/deploys.js";
import { Light } from "@airswap/protocols";
import erc20Abi from "erc-20-abi";
import { hexZeroPad, id } from "ethers/lib/utils";

interface SubscribeParams {
  activeTokenAddresses: string[];
  walletAddress: string;
  spenderAddress: string;
  provider: ethers.providers.Web3Provider;
  onBalanceChange: (
    tokenAddress: string,
    amount: BigNumber,
    direction: "in" | "out"
  ) => void;
  onApproval: (tokenAddress: string, amount: BigNumber) => void;
}

interface WalletParams {
  chainId: number;
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  tokenAddresses: string[];
}

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
  params: WalletParams
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
// event Approval(address indexed _owner, address indexed _spender, uint256 _value)
let subscribeToTransfersAndApprovals: (params: SubscribeParams) => () => void;
subscribeToTransfersAndApprovals = ({
  activeTokenAddresses,
  walletAddress,
  provider,
  onBalanceChange,
  spenderAddress,
  onApproval,
}) => {
  // event Transfer(address indexed _from, address indexed _to, uint256 _value)
  const filters: {
    in: EventFilter;
    out: EventFilter;
  } = {
    // Tokens being transferred out of our account or approved by our account
    out: {
      topics: [
        [
          id("Transfer(address,address,uint256)"),
          id("Approval(address,address,uint256)"),
        ], // event name
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
    // in or out?
    const typedDirection = direction as keyof typeof filters;
    const filter = filters[typedDirection];

    function listener(event: Event) {
      const { address } = event;
      const lowerCasedAddress = address.toLowerCase();

      // Ignore transactions for non-active tokens.
      if (!activeTokenAddresses.includes(lowerCasedAddress)) return;

      const parsedEvent = erc20Interface.parseLog(event);
      const isApproval = parsedEvent.name === "Approval";

      // Ignore approvals for other spenders.
      if (isApproval && parsedEvent.args[1].toLowerCase() !== spenderAddress)
        return;

      const amount: BigNumber = parsedEvent.args[2];
      isApproval
        ? onApproval(lowerCasedAddress, amount)
        : onBalanceChange(lowerCasedAddress, amount, typedDirection);
    }
    provider.on(filter, listener);
    tearDowns.push(provider.off.bind(provider, filter, listener));
  });

  return () => {
    tearDowns.forEach((fn) => fn());
  };
};

export { fetchBalances, fetchAllowances, subscribeToTransfersAndApprovals };
