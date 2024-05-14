import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { fetchSupportedTokens } from "./registryActions";

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
    // Reset on wallet connect or disconnect
    // .addCase(setWalletConnected, () => initialState)
    // .addCase(setWalletDisconnected, () => initialState);
  },
});

export const { setStakerTokens, setAllSupportedTokens, reset } =
  registrySlice.actions;
export const selectAllSupportedTokens = (state: RootState) =>
  state.registry.allSupportedTokens;
export default registrySlice.reducer;
