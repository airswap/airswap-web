import { getKnownTokens, TokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";

import * as ethers from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { getUniqueSingleDimensionArray } from "../../helpers/array";
import { Web3State } from "../web3/web3Slice";
import {
  getActiveTokensLocalStorageKey,
  getProtocolFee,
  getUnknownTokens,
  getUnknownTokensLocalStorageKey,
} from "./metadataApi";
import {
  setActiveTokens,
  MetadataTokenInfoMap,
  setUnknownTokens,
} from "./metadataSlice";

const transformTokenInfoArrayToMap = (tokens: TokenInfo[]) => {
  return tokens.reduce((acc, token) => {
    const address = token.address.toLowerCase();

    acc[address] = { ...token, address };
    return acc;
  }, {} as MetadataTokenInfoMap);
};

export const fetchAllTokens = createAsyncThunk<
  MetadataTokenInfoMap,
  number,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/getKnownTokens", async (chainId) => {
  const response = await getKnownTokens(chainId);

  if (response.errors.length) {
    console.error("Errors fetching metadata", response.errors);

    return {};
  }

  return transformTokenInfoArrayToMap(response.tokens);
});
export const fetchUnkownTokens = createAsyncThunk<
  MetadataTokenInfoMap,
  {
    provider: ethers.providers.BaseProvider;
    tokens: string[];
  },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/fetchUnknownTokens", async ({ provider, tokens }, thunkApi) => {
  const response = await getUnknownTokens(provider, tokens);

  if (!response) {
    return {};
  }

  return transformTokenInfoArrayToMap(response);
});
export const fetchProtocolFee = createAsyncThunk<
  number,
  {
    provider: Web3Provider;
    chainId: number;
  }
>("metadata/fetchProtocolFee", async ({ provider, chainId }) =>
  getProtocolFee(chainId, provider)
);

const writeActiveTokensToLocalStorage = (
  activeTokens: string[],
  web3: Web3State
) => {
  if (!web3.account || !web3.chainId) {
    return;
  }

  const localStorageKey = getActiveTokensLocalStorageKey(
    web3.account,
    web3.chainId
  );

  localStorage.setItem(localStorageKey, JSON.stringify(activeTokens));
};

const writeUnknownTokensToLocalStorage = (
  unknownTokens: MetadataTokenInfoMap,
  web3: Web3State
) => {
  if (!web3.chainId) {
    return;
  }

  const localStorageKey = getUnknownTokensLocalStorageKey(web3.chainId);

  localStorage.setItem(localStorageKey, JSON.stringify(unknownTokens));
};

export const addActiveToken = createAsyncThunk<
  void,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/addActiveToken", async (token, { dispatch, getState }) => {
  const { metadata, web3 } = getState();

  const activeTokens = [...metadata.activeTokens, token.toLowerCase()].filter(
    getUniqueSingleDimensionArray
  );

  writeActiveTokensToLocalStorage(activeTokens, web3);
  dispatch(setActiveTokens(activeTokens));
});

export const removeActiveToken = createAsyncThunk<
  void,
  string,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/removeActiveToken", async (token, { dispatch, getState }) => {
  const { metadata, web3 } = getState();

  const activeTokens = metadata.activeTokens.filter(
    (t) => t !== token.toLowerCase()
  );

  writeActiveTokensToLocalStorage(activeTokens, web3);
  dispatch(setActiveTokens(activeTokens));
});

export const addUnknownTokenInfo = createAsyncThunk<
  void,
  TokenInfo,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/addUnknownTokenInfo", async (tokenInfo, { dispatch, getState }) => {
  const { metadata, web3 } = getState();

  const unknownToken = {
    ...tokenInfo,
    address: tokenInfo.address.toLowerCase(),
  };

  const unknownTokens = {
    ...metadata.unknownTokens,
    [unknownToken.address]: unknownToken,
  };

  writeUnknownTokensToLocalStorage(unknownTokens, web3);

  dispatch(setUnknownTokens(unknownTokens));
});
