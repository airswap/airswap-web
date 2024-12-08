import { getKnownTokens, TokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";

import * as ethers from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { getProtocolFee, getUnknownTokens } from "./metadataApi";
import { MetadataTokenInfoMap } from "./metadataSlice";

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
