import { fetchTokens } from "@airswap/metadata";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { TokenInfo } from "@uniswap/token-lists";

import { AppDispatch, RootState } from "../../app/store";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import {
  defaultActiveTokens,
  getActiveTokensFromLocalStorage,
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
  TokenInfo[],
  void,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/fetchTokens", async (unused, thunkApi) => {
  const { wallet } = thunkApi.getState();
  if (!wallet.connected) return [];
  return await fetchTokens(wallet.chainId!);
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
      })
      .addCase(setWalletConnected, (state, action) => {
        const { chainId, address } = action.payload;
        state.tokens.active =
          getActiveTokensFromLocalStorage(address, chainId) ||
          defaultActiveTokens[chainId] ||
          [];
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
