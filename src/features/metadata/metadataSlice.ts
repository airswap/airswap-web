import { TokenInfo } from "@airswap/utils";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { fetchSupportedTokens } from "../registry/registryActions";
import { setWeb3Data } from "../web3/web3Slice";
import {
  fetchAllTokens,
  fetchProtocolFee,
  fetchUnkownTokens,
  walletDisconnected,
} from "./metadataActions";
import {
  getActiveTokensFromLocalStorage,
  getAllTokensFromLocalStorage,
  getCustomTokensFromLocalStorage,
} from "./metadataApi";

export interface MetadataTokens {
  all: {
    [address: string]: TokenInfo;
  };
  active: string[];
  custom: string[];
}

export interface MetadataState {
  isFetchingAllTokens: boolean;
  protocolFee: number;
  tokens: MetadataTokens;
}

const initialState: MetadataState = {
  isFetchingAllTokens: false,
  protocolFee: 0,
  tokens: {
    all: {},
    active: [],
    custom: [],
  },
};

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
    addCustomToken: (state, action: PayloadAction<string>) => {
      const lowerCasedToken = action.payload.trim().toLowerCase();
      if (!state.tokens.custom.includes(lowerCasedToken)) {
        state.tokens.custom.push(lowerCasedToken);
      }
    },
    addTokenInfo: (state, action: PayloadAction<TokenInfo>) => {
      state.tokens.all[action.payload.address] = action.payload;
    },
    removeActiveToken: (state, action: PayloadAction<string>) => {
      state.tokens.active = state.tokens.active.filter(
        (tokenAddress) => tokenAddress !== action.payload
      );
    },
    removeCustomToken: (state, action: PayloadAction<string>) => {
      state.tokens.custom = state.tokens.active.filter(
        (tokenAddress) => tokenAddress !== action.payload
      );
    },
    setTokens: (state, action: PayloadAction<MetadataTokens>) => {
      return {
        ...state,
        tokens: action.payload,
      };
    },
  },
  extraReducers: async (builder) => {
    builder
      .addCase(fetchAllTokens.pending, (state) => {
        return {
          ...state,
          isFetchingAllTokens: true,
        };
      })
      .addCase(fetchAllTokens.fulfilled, (state, action) => {
        const { payload: tokenInfo } = action;
        const newAllTokens = tokenInfo.reduce(
          (allTokens: MetadataTokens["all"], token) => {
            const address = token.address.toLowerCase();
            if (!allTokens[address]) {
              allTokens[address] = {
                ...token,
                address: token.address.toLowerCase(),
              };
            }
            return allTokens;
          },
          {}
        );

        const stateAllTokens = Object.keys(state.tokens.all).reduce(
          (allTokens: MetadataTokens["all"], token) => {
            return {
              ...allTokens,
              [token.toLowerCase()]: state.tokens.all[token],
            };
          },
          {}
        );

        const tokens = {
          ...state.tokens,
          all: {
            ...stateAllTokens,
            ...newAllTokens,
          },
        };

        return {
          ...state,
          isFetchingAllTokens: false,
          tokens,
        };
      })
      .addCase(fetchAllTokens.rejected, (state) => {
        // TODO: handle failure?
        // perhaps rejected state can be for when errors.length === known.length ?
        return {
          ...state,
          isFetchingAllTokens: false,
        };
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
      .addCase(fetchProtocolFee.fulfilled, (state, action) => {
        state.protocolFee = action.payload;
      })
      .addCase(walletDisconnected, () => {
        return initialState;
      });
  },
});

export const {
  addActiveToken,
  addCustomToken,
  addTokenInfo,
  removeActiveToken,
  removeCustomToken,
  setTokens,
} = metadataSlice.actions;

const selectActiveTokenAddresses = (state: RootState) =>
  state.metadata.tokens.active;
export const selectCustomTokenAddresses = (state: RootState) =>
  state.metadata.tokens.custom;
export const selectAllTokenInfo = (state: RootState) => [
  ...Object.values(state.metadata.tokens.all),
];
export const selectActiveTokens = createSelector(
  [selectActiveTokenAddresses, selectAllTokenInfo],
  (activeTokenAddresses, allTokenInfo) => {
    return Object.values(allTokenInfo).filter((tokenInfo) =>
      activeTokenAddresses.includes(tokenInfo.address)
    );
  }
);
export const selectActiveTokensWithoutCustomTokens = createSelector(
  [selectActiveTokenAddresses, selectCustomTokenAddresses, selectAllTokenInfo],
  (activeTokenAddresses, customTokenAddresses, allTokenInfo) => {
    return Object.values(allTokenInfo).filter(
      (tokenInfo) =>
        activeTokenAddresses.includes(tokenInfo.address) &&
        !customTokenAddresses.includes(tokenInfo.address)
    );
  }
);
export const selectMetaDataReducer = (state: RootState) => state.metadata;
export const selectProtocolFee = (state: RootState) =>
  state.metadata.protocolFee;

export default metadataSlice.reducer;
