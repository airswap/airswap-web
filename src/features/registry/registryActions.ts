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
    provider: providers.Provider;
  },
  {
    // Optional fields for defining thunkApi field types
    dispatch: AppDispatch;
    state: RootState;
  }
>("registry/fetchSupportedTokens", async ({ provider }, { getState }) => {
  const { web3 } = getState();
  const stakerTokens = await getStakerTokens(web3.chainId!, provider);
  // Combine token lists from all makers and flatten them.
  const allSupportedTokens = uniqBy(
    Object.values(stakerTokens).flat(),
    (i) => i
  );
  const activeTokensLocalStorage = getActiveTokensFromLocalStorage(
    web3.account!,
    web3.chainId!
  );
  const activeTokens =
    (activeTokensLocalStorage.length && activeTokensLocalStorage) ||
    allSupportedTokens ||
    [];
  return { stakerTokens, allSupportedTokens, activeTokens };
});
