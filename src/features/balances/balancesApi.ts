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
import getWethAddress from "../../helpers/getWethAddress";

interface WalletParams {
  chainId: number;
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  tokenAddresses: string[];
  tokenIds?: string[];
  tokenKind: TokenKinds.ERC20 | TokenKinds.ERC721 | TokenKinds.ERC1155;
}

type FetchMethodType = "balances" | "allowances";
type SpenderAddressType =
  | "Wrapper"
  | "Swap"
  | "SwapERC20"
  | "Delegate"
  | "None";
type BalanceRequestType =
  | "balances"
  | "allowances.swap"
  | "allowances.wrapper"
  | "allowances.delegate";

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

  if (spenderAddressType === "Swap") {
    return Swap.getAddress(chainId);
  }

  return ADDRESS_ZERO;
};

const getFetchBalancesOrAllowancesArgs = (
  method: FetchMethodType,
  spenderAddressType: SpenderAddressType,
  params: WalletParams
) => {
  const { chainId, tokenAddresses, walletAddress, tokenIds = [] } = params;

  if (method === "balances") {
    return [walletAddress, tokenAddresses, tokenIds];
  }

  const allowanceSpenderAddress = getAllowanceSpenderAddress(
    spenderAddressType,
    chainId
  );

  return [walletAddress, allowanceSpenderAddress, tokenAddresses, tokenIds];
};

/**
 * Fetches balances or allowances for a wallet using the airswap utility
 * contract `BalanceChecker.sol`. Balances are returned in base units.
 */
const fetchBalancesOrAllowances: (
  type: FetchMethodType,
  spenderAddressType: SpenderAddressType,
  params: WalletParams
) => Promise<string[]> = async (type, spenderAddressType, params) => {
  const { chainId, provider, tokenKind } = params;
  const contract = BatchCall.getContract(provider, chainId);

  const args = getFetchBalancesOrAllowancesArgs(
    type,
    spenderAddressType,
    params
  );
  const method = getMethod(type, tokenKind);

  const amounts: BigNumber[] = await contract[method].apply(null, args);
  return amounts.map((amount) => amount.toString());
};

export const getSetInFlightRequestTokensAction = (type: BalanceRequestType) => {
  return createAction<string[]>(`${type}/setInFlightRequestTokens`);
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
    (params: WalletParams) => Promise<string[]>
  > = {
    balances: fetchBalances,
    "allowances.swap": fetchAllowancesSwap,
    "allowances.wrapper": fetchAllowancesWrapper,
    "allowances.delegate": fetchAllowancesDelegate,
  };
  return createAsyncThunk<
    { address: string; amount: string }[],
    {
      provider: ethers.providers.Web3Provider;
    },
    {
      // Optional fields for defining thunkApi field types
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
        const allTokens: AppTokenInfo[] = [
          ...Object.values(knownTokens),
          ...Object.values(unknownTokens),
        ];
        const nftTokens = allTokens.filter((token) =>
          isCollectionTokenInfo(token)
        ) as CollectionTokenInfo[];
        const erc721Tokens = nftTokens.filter(
          (token) => token.kind === TokenKinds.ERC721
        );
        const erc1155Tokens = nftTokens.filter(
          (token) => token.kind === TokenKinds.ERC1155
        );

        const wrappedNativeToken = chainId
          ? getWethAddress(chainId)
          : undefined;
        const activeErc20Addresses = [
          ...activeTokens,
          ...(wrappedNativeToken ? [wrappedNativeToken] : []),
          ADDRESS_ZERO,
        ].filter(isAddress);

        const activeErc721Addresses = activeTokens.filter((token) =>
          erc721Tokens.some(
            (t) => getTokenIdentifier(t.address, t.id) === token
          )
        );
        const activeErc1155Addresses = activeTokens.filter((token) =>
          erc1155Tokens.some(
            (t) => getTokenIdentifier(t.address, t.id) === token
          )
        );

        // TODO: this is probably not needed.
        // if (state.takeOtc.activeOrder) {
        //   activeErc20Addresses.push(state.takeOtc.activeOrder.sender.token);
        // }

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
          amount: "1",
        }));
        const erc1155Balances = activeErc1155Addresses.map((address, i) => ({
          address,
          amount: "1",
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

const fetchBalances = fetchBalancesOrAllowances.bind(null, "balances", "None");
const fetchAllowancesSwap = fetchBalancesOrAllowances.bind(
  null,
  "allowances",
  "Swap"
);
const fetchAllowancesWrapper = fetchBalancesOrAllowances.bind(
  null,
  "allowances",
  "Wrapper"
);
const fetchAllowancesDelegate = fetchBalancesOrAllowances.bind(
  null,
  "allowances",
  "Delegate"
);
