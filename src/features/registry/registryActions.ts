import { createAsyncThunk } from "@reduxjs/toolkit";

import { providers } from "ethers";
import uniqBy from "lodash.uniqby";

import { AppDispatch, RootState } from "../../app/store";
import { getActiveTokensFromLocalStorage } from "../metadata/metadataApi";
import { getStakerTokens } from "./registryApi";

export const fetchSupportedTokens = createAsyncThunk<
  {
    allSupportedTokens: string[];
    stakerTokens: Record<string, string[]>;
    activeTokens: string[];
  },
  {
    account: string;
    chainId: number;
    provider: providers.Provider;
  },
  {
    // Optional fields for defining thunkApi field types
    dispatch: AppDispatch;
    state: RootState;
  }
>("registry/fetchSupportedTokens", async ({ account, chainId, provider }) => {
  const stakerTokens = await getStakerTokens(chainId, provider);

  // Combine token lists from all makers and flatten them.
  const allSupportedTokens = uniqBy(
    Object.values(stakerTokens).flat(),
    (i) => i
  );
  const activeTokensLocalStorage = getActiveTokensFromLocalStorage(
    account,
    chainId
  );
  const activeTokens =
    (activeTokensLocalStorage.length && activeTokensLocalStorage) ||
    allSupportedTokens ||
    [];
  return { stakerTokens, allSupportedTokens, activeTokens };
});
