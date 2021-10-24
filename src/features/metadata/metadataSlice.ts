import { fetchTokens } from "@airswap/metadata";
import { TokenInfo } from "@airswap/types";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { fetchSupportedTokens } from "../registry/registrySlice";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import {
  getActiveTokensFromLocalStorage,
  getUnknownTokens,
} from "./metadataApi";

export interface MetadataState {
  tokens: {
    all: {
      [address: string]: TokenInfo;
    };
    active: string[];
  };
}

const initialState: MetadataState = {
  tokens: {
    all: {},
    active: [],
  },
};

export const fetchAllTokens = createAsyncThunk<
  TokenInfo[], // Return type
  void, // First argument
  {
    // thunkApi
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/fetchTokens", async (_, thunkApi) => {
  const { wallet } = thunkApi.getState();
  if (!wallet.connected) return [];
  return (await fetchTokens(wallet.chainId!)).tokens;
});

export const fetchUnkownTokens = createAsyncThunk<
  TokenInfo[], // Return type
  {
    // First argument
    provider: providers.Provider;
  },
  {
    // thunkApi
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/fetchUnknownTokens", async ({ provider }, thunkApi) => {
  const { registry, metadata, wallet } = thunkApi.getState();
  if (wallet.chainId === null) return [];
  return await getUnknownTokens(
    wallet.chainId,
    registry.allSupportedTokens,
    Object.values(metadata.tokens.all),
    provider
  );
});

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    addActiveToken: (state, action: PayloadAction<string>) => {
      const lowerCasedToken = action.payload.trim().toLowerCase();
      if (!state.tokens.active.includes(lowerCasedToken)) {
        state.tokens.active.push(lowerCasedToken);
      }
    },
    removeActiveToken: (state, action: PayloadAction<string>) => {
      if (state.tokens.active.includes(action.payload)) {
        state.tokens.active = state.tokens.active.filter(
          (tokenAddress) => tokenAddress !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTokens.pending, (state) => {
        // TODO: consider whether we need to put a pending state to prevent dupes
      })
      .addCase(fetchAllTokens.fulfilled, (state, action) => {
        const { payload: tokenInfo } = action;
        state.tokens.all = tokenInfo.reduce(
          (allTokens: { [address: string]: TokenInfo }, token) => {
            const { address } = token;
            if (!allTokens[address]) {
              allTokens[address] = { ...token };
            }
            return allTokens;
          },
          {}
        );
      })
      .addCase(fetchAllTokens.rejected, (state) => {
        // TODO: handle failure?
        // perhaps rejected state can be for when errors.length === known.length ?
      })
      .addCase(fetchSupportedTokens.fulfilled, (state, action) => {
        if (!state.tokens.active?.length)
          state.tokens.active = action.payload.activeTokens || [];
      })
      .addCase(fetchUnkownTokens.fulfilled, (state, action) => {
        action.payload.forEach((token) => {
          state.tokens.all[token.address] = token;
        });
      })
      .addCase(setWalletConnected, (state, action) => {
        const { chainId, address } = action.payload;
        state.tokens.active =
          getActiveTokensFromLocalStorage(address, chainId) || [];
      })
      .addCase(setWalletDisconnected, (state) => {
        state.tokens.active = [];
      });
  },
});

export const { addActiveToken, removeActiveToken } = metadataSlice.actions;

const selectActiveTokenAddresses = (state: RootState) =>
  state.metadata.tokens.active;
export const selectAllTokenInfo = (state: RootState) =>
  Object.values(state.metadata.tokens.all);
export const selectActiveTokens = createSelector(
  [selectActiveTokenAddresses, selectAllTokenInfo],
  (activeTokenAddresses, allTokenInfo) => {
    return Object.values(allTokenInfo).filter((tokenInfo) =>
      activeTokenAddresses.includes(tokenInfo.address)
    );
  }
);

export default metadataSlice.reducer;
