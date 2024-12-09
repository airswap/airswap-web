import { createAsyncThunk } from "@reduxjs/toolkit";

import { providers } from "ethers";
import uniqBy from "lodash.uniqby";

import { AppDispatch, RootState } from "../../app/store";
import { getStakerTokens } from "./registryApi";

export const fetchSupportedTokens = createAsyncThunk<
  {
    allSupportedTokens: string[];
    stakerTokens: Record<string, string[]>;
  },
  {
    account: string;
    chainId: number;
    provider: providers.Provider;
  },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("registry/fetchSupportedTokens", async ({ chainId, provider }) => {
  const stakerTokens = await getStakerTokens(chainId, provider);

  const allSupportedTokens = uniqBy(
    Object.values(stakerTokens).flat(),
    (i) => i
  );

  return { stakerTokens, allSupportedTokens };
});
