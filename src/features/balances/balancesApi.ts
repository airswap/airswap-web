import { SwapERC20, Wrapper, Balances } from "@airswap/libraries";

import erc20Abi from "erc-20-abi";
import { BigNumber, ethers, EventFilter, Event } from "ethers";
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
  onApproval: (
    tokenAddress: string,
    spenderAddress: string,
    amount: BigNumber
  ) => void;
}

interface WalletParams {
  chainId: number;
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  tokenAddresses: string[];
}

const erc20Interface = new ethers.utils.Interface(erc20Abi);

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
  const contract = Balances.getContract(provider, chainId);
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
      const lowerCasedTokenAddress = address.toLowerCase();

      // Ignore transactions for non-active tokens.
      if (!activeTokenAddresses.includes(lowerCasedTokenAddress)) return;

      const parsedEvent = erc20Interface.parseLog(event);
      const isApproval = parsedEvent.name === "Approval";

      // Ignore approvals for other spenders.
      const approvalAddress = parsedEvent.args[1].toLowerCase();
      const wrapperAddress = Wrapper.getAddress(
        provider.network.chainId
      ).toLowerCase();
      if (
        isApproval &&
        approvalAddress !== spenderAddress.toLowerCase() &&
        approvalAddress !== wrapperAddress
      )
        return;

      const amount: BigNumber = parsedEvent.args[2];
      isApproval
        ? onApproval(lowerCasedTokenAddress, approvalAddress, amount)
        : onBalanceChange(lowerCasedTokenAddress, amount, typedDirection);
    }
    provider.on(filter, listener);
    tearDowns.push(provider.off.bind(provider, filter, listener));
  });

  return () => {
    tearDowns.forEach((fn) => fn());
  };
};

export {
  fetchBalances,
  fetchAllowancesSwap,
  fetchAllowancesWrapper,
  subscribeToTransfersAndApprovals,
};
