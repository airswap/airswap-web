import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import {
  chainIdChanged,
  walletChanged,
  walletDisconnected,
} from "../web3/web3Actions";
import { fetchSupportedTokens } from "./registryActions";

export interface RegistryState {
  isFetchingSupportedTokensSuccess: boolean;
  stakerTokens: Record<string, string[]>;
  allSupportedTokens: string[];
  status: "idle" | "fetching" | "failed";
}

const initialState: RegistryState = {
  isFetchingSupportedTokensSuccess: false,
  stakerTokens: {},
  allSupportedTokens: [],
  status: "idle",
};

export const registrySlice = createSlice({
  name: "registry",
  initialState,
  reducers: {
    reset: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportedTokens.pending, (state) => {
        return {
          ...state,
          isFetchingSupportedTokensSuccess: false,
          status: "fetching",
        };
      })
      .addCase(fetchSupportedTokens.fulfilled, (state, action) => {
        return {
          ...state,
          isFetchingSupportedTokensSuccess: true,
          status: "idle",
          allSupportedTokens: action.payload.allSupportedTokens,
          stakerTokens: action.payload.stakerTokens,
        };
      })
      .addCase(fetchSupportedTokens.rejected, (state) => {
        return {
          ...state,
          status: "failed",
        };
      })
      .addCase(walletDisconnected, () => initialState)
      .addCase(chainIdChanged, () => initialState);
  },
});

export const { reset } = registrySlice.actions;
export const selectAllSupportedTokens = (state: RootState) =>
  state.registry.allSupportedTokens;
export default registrySlice.reducer;
