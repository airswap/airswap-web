import {
  Wrapper,
  BatchCall,
  Delegate,
  SwapERC20,
  Swap,
} from "@airswap/libraries";
import { ADDRESS_ZERO, CollectionTokenInfo, TokenKinds } from "@airswap/utils";
import { AsyncThunk, createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { BigNumber, ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";

import { AppDispatch } from "../../app/store";
import { RootState } from "../../app/store";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  getAddressFromTokenIdentifier,
  getIdFromTokenIdentifier,
  getTokenIdentifier,
  isCollectionTokenInfo,
} from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { isFullOrder } from "../../entities/FullOrder/FullOrderHelpers";
import getWethAddress from "../../helpers/getWethAddress";

/**
 * Type for the fetch method - either fetching balances or allowances
 */
type FetchMethodType = "balances" | "allowances";

/**
 * Type for the spender address - which contract we're checking allowances for
 */
export type SpenderAddressType = "Wrapper" | "Swap" | "SwapERC20" | "Delegate";

/**
 * Type for balance request operations
 */
type BalanceRequestType =
  | "balances"
  | "allowances.swap"
  | "allowances.swapERC20"
  | "allowances.wrapper"
  | "allowances.delegate";

/**
 * Parameters required for fetching balances or allowances
 */
interface FetchParams {
  chainId: number;
  provider: ethers.providers.Web3Provider;
  tokenKind: TokenKinds.ERC20 | TokenKinds.ERC721 | TokenKinds.ERC1155;
  tokenAddresses: string[];
  tokenIds?: string[];
  walletAddress: string;
}

const METHOD_MAP = {
  balances: {
    [TokenKinds.ERC721]: "walletBalancesERC721",
    [TokenKinds.ERC1155]: "walletBalancesERC1155",
    [TokenKinds.ERC20]: "walletBalances",
  },
  allowances: {
    [TokenKinds.ERC721]: "walletAllowancesERC721",
    [TokenKinds.ERC1155]: "walletAllowancesERC1155",
    [TokenKinds.ERC20]: "walletAllowances",
  },
} as const;

const getMethod = (
  method: FetchMethodType,
  tokenKind: TokenKinds.ERC20 | TokenKinds.ERC721 | TokenKinds.ERC1155
) => {
  return METHOD_MAP[method][tokenKind];
};

const getAllowanceSpenderAddress = (
  spenderAddressType: SpenderAddressType,
  chainId: number
) => {
  if (spenderAddressType === "Delegate") {
    return Delegate.getAddress(chainId);
  }

  if (spenderAddressType === "Wrapper") {
    return Wrapper.getAddress(chainId);
  }

  if (spenderAddressType === "SwapERC20") {
    return SwapERC20.getAddress(chainId);
  }

  return Swap.getAddress(chainId);
};

const getFetchBalancesOrAllowancesArgs = (
  method: FetchMethodType,
  params: FetchParams,
  spenderAddressType?: SpenderAddressType
) => {
  const { chainId, tokenAddresses, walletAddress, tokenIds = [] } = params;

  if (method === "balances") {
    return [walletAddress, tokenAddresses, tokenIds];
  }

  const allowanceSpenderAddress = spenderAddressType
    ? getAllowanceSpenderAddress(spenderAddressType, chainId)
    : ADDRESS_ZERO;

  if (params.tokenKind === TokenKinds.ERC1155) {
    return [walletAddress, allowanceSpenderAddress, tokenAddresses];
  }

  return [walletAddress, allowanceSpenderAddress, tokenAddresses, tokenIds];
};

/**
 * Fetches either balances or allowances for a given set of tokens
 * @param fetchType - Whether to fetch balances or allowances
 * @param params - Parameters including chainId, provider, token details, and wallet address
 * @param spenderType - Optional: Which contract to check allowances for (if fetching allowances)
 * @returns Promise resolving to an array of balance/allowance amounts as strings
 */
async function fetchBalancesOrAllowances(
  fetchType: FetchMethodType,
  params: FetchParams,
  spenderType?: SpenderAddressType
): Promise<string[]> {
  const { chainId, provider, tokenKind } = params;

  if (!params.tokenAddresses.length) {
    return [];
  }

  // Get the BatchCall contract instance
  const contract = BatchCall.getContract(provider, chainId);

  // Prepare arguments for the contract call
  const callArgs = getFetchBalancesOrAllowancesArgs(
    fetchType,
    params,
    spenderType
  );

  // Get the appropriate method name based on token kind and fetch type
  const methodName = getMethod(fetchType, tokenKind);

  // Execute the contract call and convert BigNumber results to strings
  const amounts: BigNumber[] = await contract[methodName].apply(null, callArgs);
  return amounts.map((amount) => amount.toString());
}

export const getSetInFlightRequestTokensAction = (type: BalanceRequestType) => {
  return createAction<string[]>(`${type}/setInFlightRequestTokens`);
};

/**
 * Processes active tokens and categorizes them by token type
 * @param activeTokens - Array of active token identifiers
 * @param allTokens - Array of all token information
 * @param chainId - Current chain ID
 * @returns Object containing categorized token addresses
 */
const processActiveTokens = (
  activeTokens: string[],
  allTokens: AppTokenInfo[],
  chainId: number
) => {
  const nftTokens = allTokens.filter((token) =>
    isCollectionTokenInfo(token)
  ) as CollectionTokenInfo[];
  const erc721Tokens = nftTokens.filter(
    (token) => token.kind === TokenKinds.ERC721
  );
  const erc1155Tokens = nftTokens.filter(
    (token) => token.kind === TokenKinds.ERC1155
  );

  const wrappedNativeToken = chainId ? getWethAddress(chainId) : undefined;
  const activeErc20Addresses = [
    ...activeTokens,
    ...(wrappedNativeToken ? [wrappedNativeToken] : []),
    ADDRESS_ZERO,
  ].filter(isAddress);

  const activeErc721Addresses = activeTokens.filter((token) =>
    erc721Tokens.some((t) => getTokenIdentifier(t.address, t.id) === token)
  );
  const activeErc1155Addresses = activeTokens.filter((token) =>
    erc1155Tokens.some((t) => getTokenIdentifier(t.address, t.id) === token)
  );

  return {
    activeErc20Addresses,
    activeErc721Addresses,
    activeErc1155Addresses,
  };
};

export const getThunk: (type: BalanceRequestType) => AsyncThunk<
  { address: string; amount: string }[],
  {
    provider: ethers.providers.Web3Provider;
  },
  object
> = (type: BalanceRequestType) => {
  const methods: Record<
    BalanceRequestType,
    (params: FetchParams) => Promise<string[]>
  > = {
    balances: fetchBalances,
    "allowances.swap": fetchAllowancesSwap,
    "allowances.swapERC20": fetchAllowancesSwapERC20,
    "allowances.wrapper": fetchAllowancesWrapper,
    "allowances.delegate": fetchAllowancesDelegate,
  };
  return createAsyncThunk<
    { address: string; amount: string }[],
    {
      provider: ethers.providers.Web3Provider;
    },
    {
      dispatch: AppDispatch;
      state: RootState;
    }
  >(
    `${type}/requestForActiveTokens`,
    async (params, { getState, dispatch }) => {
      try {
        const state = getState();
        const { chainId, account } = state.web3;
        const { activeTokens, unknownTokens, knownTokens } = state.metadata;
        const { activeOrder } = state.takeOtc;
        const { delegateRule } = state.takeLimit;
        const allTokens: AppTokenInfo[] = [
          ...Object.values(knownTokens),
          ...Object.values(unknownTokens),
        ];

        const activeOtcOrderToken = activeOrder
          ? isFullOrder(activeOrder)
            ? activeOrder.sender.token
            : activeOrder.senderToken
          : undefined;
        const activeDelegateOrderToken = delegateRule
          ? delegateRule.senderToken
          : undefined;

        const {
          activeErc20Addresses,
          activeErc721Addresses,
          activeErc1155Addresses,
        } = processActiveTokens(
          [
            ...activeTokens,
            ...(activeOtcOrderToken ? [activeOtcOrderToken] : []),
            ...(activeDelegateOrderToken ? [activeDelegateOrderToken] : []),
          ],
          allTokens,
          chainId!
        );

        dispatch(
          getSetInFlightRequestTokensAction(type)([
            ...activeErc20Addresses,
            ...activeErc721Addresses,
            ...activeErc1155Addresses,
          ])
        );

        const methodParams = {
          ...params,
          chainId: chainId!,
          walletAddress: account!,
        };

        const erc20Amounts = (await methods[type]({
          ...methodParams,
          tokenAddresses: activeErc20Addresses,
          tokenKind: TokenKinds.ERC20,
        })) as string[];

        const erc721Amounts = await methods[type]({
          ...methodParams,
          tokenAddresses: activeErc721Addresses.map(
            getAddressFromTokenIdentifier
          ),
          tokenIds: activeErc721Addresses.map(getIdFromTokenIdentifier),
          tokenKind: TokenKinds.ERC721,
        });

        const erc1155Amounts = await methods[type]({
          ...methodParams,
          tokenAddresses: activeErc1155Addresses.map(
            getAddressFromTokenIdentifier
          ),
          tokenIds: activeErc1155Addresses.map(getIdFromTokenIdentifier),
          tokenKind: TokenKinds.ERC1155,
        });

        const tokenBalances = activeErc20Addresses.map((address, i) => ({
          address,
          amount: erc20Amounts[i],
        }));
        const erc721Balances = activeErc721Addresses.map((address, i) => ({
          address,
          amount:
            // ERC721 approve is either true or false, balance is either 1 or 0.
            erc721Amounts[i] === "true" || erc721Amounts[i] === "1" ? "1" : "0",
        }));
        const erc1155Balances = activeErc1155Addresses.map((address, i) => ({
          address,
          amount:
            // ERC1155 uses isApprovedForAll, so we need to check for true/false
            erc1155Amounts[i] === "true"
              ? "99999"
              : erc1155Amounts[i] === "false"
              ? "0"
              : // Else it's a number for balance
                erc1155Amounts[i],
        }));

        return [...tokenBalances, ...erc721Balances, ...erc1155Balances];
      } catch (e: any) {
        console.error(`Error fetching ${type}: ` + e.message);
        throw e;
      }
    },
    {
      // Logic to prevent fetching again if we're already fetching the same or more tokens.
      condition: (params, { getState }) => {
        const pathParts = type.split(".");
        const sliceState =
          pathParts.length > 1
            ? // @ts-ignore
              getState()[pathParts[0]][pathParts[1]]
            : // @ts-ignore
              getState()[type];
        // If we're not fetching, definitely continue
        if (sliceState.status !== "fetching") return true;
        if (sliceState.inFlightFetchTokens) {
          const tokensToFetch = getState().metadata.activeTokens;
          // only fetch if new list is larger.
          return tokensToFetch.length > sliceState.inFlightFetchTokens.length;
        }
      },
    }
  );
};

const fetchBalances = (params: FetchParams) =>
  fetchBalancesOrAllowances("balances", params);
const fetchAllowancesSwap = (params: FetchParams) =>
  fetchBalancesOrAllowances("allowances", params, "Swap");
const fetchAllowancesSwapERC20 = (params: FetchParams) =>
  fetchBalancesOrAllowances("allowances", params, "SwapERC20");
const fetchAllowancesWrapper = (params: FetchParams) =>
  fetchBalancesOrAllowances("allowances", params, "Wrapper");
const fetchAllowancesDelegate = (params: FetchParams) =>
  fetchBalancesOrAllowances("allowances", params, "Delegate");
