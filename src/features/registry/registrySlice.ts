import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { providers } from "ethers";
import uniqBy from "lodash.uniqby";

import { AppDispatch, RootState } from "../../app/store";
import { getStakerTokens } from "./registryApi";

export interface RegistryState {
  stakerTokens: Record<string, string[]>;
  allSupportedTokens: string[];
  status: "idle" | "fetching" | "failed";
}

const initialState: RegistryState = {
  stakerTokens: {},
  allSupportedTokens: [],
  status: "idle",
};

export const fetchSupportedTokens = createAsyncThunk<
  { allSupportedTokens: string[]; stakerTokens: Record<string, string[]> },
  {
    provider: providers.Provider;
  },
  {
    // Optional fields for defining thunkApi field types
    dispatch: AppDispatch;
    state: RootState;
  }
>("registry/fetchSupportedTokens", async ({ provider }, { getState }) => {
  const stakerTokens = await getStakerTokens(
    getState().wallet.chainId!,
    provider
  );
  // Combine token lists from all makers and flatten them.
  const allSupportedTokens = uniqBy(
    Object.values(stakerTokens).flat(),
    (i) => i
  );
  return { stakerTokens, allSupportedTokens };
});

export const registrySlice = createSlice({
  name: "registry",
  initialState,
  reducers: {
    setStakerTokens: (
      state,
      action: PayloadAction<Record<string, string[]>>
    ) => {
      state.stakerTokens = { ...action.payload };
    },
    setAllSupportedTokens: (state, action: PayloadAction<string[]>) => {
      state.allSupportedTokens = [...action.payload];
    },
    reset: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportedTokens.pending, (state) => {
        state.status = "fetching";
      })
      .addCase(fetchSupportedTokens.fulfilled, (state, action) => {
        state.status = "idle";
        state.allSupportedTokens = [...action.payload.allSupportedTokens];
        state.stakerTokens = { ...action.payload.stakerTokens };
      })
      .addCase(fetchSupportedTokens.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  setStakerTokens,
  setAllSupportedTokens,
  reset,
} = registrySlice.actions;
export const selectAllSupportedTokens = (state: RootState) =>
  state.registry.allSupportedTokens;
export default registrySlice.reducer;
