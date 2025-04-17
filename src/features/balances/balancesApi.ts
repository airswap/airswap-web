import { Wrapper, BatchCall, Delegate } from "@airswap/libraries";
import { ADDRESS_ZERO, CollectionTokenInfo, TokenKinds } from "@airswap/utils";
import { AsyncThunk, createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { BigNumber, ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";

import { AppDispatch } from "../../app/store";
import { RootState } from "../../app/store";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenIdentifier,
  isCollectionTokenInfo,
  isNftTokenId,
} from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
import getWethAddress from "../../helpers/getWethAddress";
import { getSwapErc20Address } from "../../helpers/swapErc20";

interface WalletParams {
  chainId: number;
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  tokenAddresses: string[];
  tokenIds?: string[];
}

const getFetchBalancesOrAllowancesArgs = (
  method:
    | "walletBalances"
    | "walletBalancesERC721"
    | "walletBalancesERC1155"
    | "walletAllowances",
  spenderAddressType: "Wrapper" | "Swap" | "Delegate" | "None",
  params: WalletParams
) => {
  const { chainId, tokenAddresses, walletAddress, tokenIds = [] } = params;

  if (method === "walletBalances") {
    return [walletAddress, tokenAddresses];
  }

  if (method === "walletBalancesERC721") {
    return [walletAddress, tokenAddresses, tokenIds];
  }

  if (method === "walletBalancesERC1155") {
    return [walletAddress, tokenAddresses, tokenIds];
  }

  if (spenderAddressType === "Delegate") {
    return [walletAddress, Delegate.getAddress(chainId), tokenAddresses];
  }

  if (spenderAddressType === "Wrapper") {
    return [walletAddress, Wrapper.getAddress(chainId), tokenAddresses];
  }

  return [walletAddress, getSwapErc20Address(chainId), tokenAddresses];
};

/**
 * Fetches balances or allowances for a wallet using the airswap utility
 * contract `BalanceChecker.sol`. Balances are returned in base units.
 */
const fetchBalancesOrAllowances: (
  method:
    | "walletBalances"
    | "walletBalancesERC721"
    | "walletBalancesERC1155"
    | "walletAllowances",
  spenderAddressType: "Wrapper" | "Swap" | "Delegate" | "None",
  params: WalletParams
) => Promise<string[]> = async (method, spenderAddressType, params) => {
  const { chainId, provider } = params;
  const contract = BatchCall.getContract(provider, chainId);
  const args = getFetchBalancesOrAllowancesArgs(
    method,
    spenderAddressType,
    params
  );

  const amounts: BigNumber[] = await contract[method].apply(null, args);
  return amounts.map((amount) => amount.toString());
};

export const getSetInFlightRequestTokensAction = (
  type:
    | "balances"
    | "allowances.swap"
    | "allowances.wrapper"
    | "allowances.delegate"
) => {
  return createAction<string[]>(`${type}/setInFlightRequestTokens`);
};

export const getThunk: (
  type:
    | "balances"
    | "allowances.swap"
    | "allowances.wrapper"
    | "allowances.delegate"
) => AsyncThunk<
  { address: string; amount: string }[],
  {
    provider: ethers.providers.Web3Provider;
  },
  object
> = (
  type:
    | "balances"
    | "allowances.swap"
    | "allowances.wrapper"
    | "allowances.delegate"
) => {
  const methods = {
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

        console.log(type);

        const wrappedNativeToken = chainId
          ? getWethAddress(chainId)
          : undefined;
        const activeErc20Addresses = [
          ...activeTokens,
          ...(wrappedNativeToken ? [wrappedNativeToken] : []),
          ADDRESS_ZERO,
        ].filter(isAddress);
        console.log(erc721Tokens);
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

        console.log("activeErc721Addresses", activeErc721Addresses);

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

        const erc20Amounts = await methods[type]({
          ...params,
          chainId: chainId!,
          walletAddress: account!,
          tokenAddresses: activeErc20Addresses,
        });

        console.log(
          activeErc721Addresses.map((address) => address.split("-")[0])
        );
        console.log(
          activeErc721Addresses.map((address) => address.split("-")[1])
        );

        const erc721Amounts = await methods[type]({
          ...params,
          chainId: chainId!,
          walletAddress: account!,
          tokenAddresses: activeErc721Addresses.map(
            (address) => address.split("-")[0]
          ),
          tokenIds: activeErc721Addresses.map(
            (address) => address.split("-")[1]
          ),
        });

        console.log(erc721Amounts);

        const erc1155Amounts = await methods[type]({
          ...params,
          chainId: chainId!,
          walletAddress: account!,
          tokenAddresses: activeErc1155Addresses,
        });

        const tokenBalances = activeErc20Addresses.map((address, i) => ({
          address,
          amount: erc20Amounts[i],
        }));
        const nftBalances = activeErc721Addresses.map((address, i) => ({
          address,
          // TODO: This is a placeholder for getting nft balance, hopefully we can get balances
          // via the BatchCall contract
          amount: "1",
        }));

        return [...tokenBalances, ...nftBalances];
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
const fetchAllowancesDelegate = fetchBalancesOrAllowances.bind(
  null,
  "walletAllowances",
  "Delegate"
);
