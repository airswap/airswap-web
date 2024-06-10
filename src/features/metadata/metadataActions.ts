import { getKnownTokens, TokenInfo } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { createAsyncThunk } from "@reduxjs/toolkit";

import * as ethers from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { getProtocolFee, getUnknownTokens } from "./metadataApi";

export const fetchAllTokens = createAsyncThunk<
  TokenInfo[], // Return type
  number, // First argument
  {
    // thunkApi
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/getKnownTokens", async (chainId, thunkApi) => {
  const res = await getKnownTokens(chainId);
  if (res.errors.length) {
    console.log("Errors fetching metadata", res.errors);
    return [];
  } else return res.tokens;
});
export const fetchUnkownTokens = createAsyncThunk<
  TokenInfo[], // Return type
  {
    // First argument
    provider: ethers.providers.BaseProvider;
  },
  {
    // thunkApi
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/fetchUnknownTokens", async ({ provider }, thunkApi) => {
  const { registry, metadata, web3 } = thunkApi.getState();
  if (!web3.chainId) return [];

  return await getUnknownTokens(
    web3.chainId!,
    registry.allSupportedTokens,
    Object.values(metadata.tokens.all),
    provider
  );
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
