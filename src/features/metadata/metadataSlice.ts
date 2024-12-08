import { TokenInfo } from "@airswap/utils";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { fetchSupportedTokens } from "../registry/registryActions";
import {
  chainIdChanged,
  walletChanged,
  walletDisconnected,
} from "../web3/web3Actions";
import { selectChainId } from "../web3/web3Slice";
import {
  fetchAllTokens,
  fetchProtocolFee,
  fetchUnkownTokens,
} from "./metadataActions";

export interface MetadataTokens {
  active: string[];
  custom: string[];
}

export type MetadataTokenInfoMap = {
  [address: string]: TokenInfo;
};

export interface MetadataState {
  isFetchingAllTokens: boolean;
  customTokens: MetadataTokenInfoMap;
  knownTokens: MetadataTokenInfoMap;
  unknownTokens: MetadataTokenInfoMap;
  protocolFee: number;
  tokens: MetadataTokens;
}

const initialState: MetadataState = {
  isFetchingAllTokens: false,
  customTokens: {},
  knownTokens: {},
  unknownTokens: {},
  protocolFee: 0,
  tokens: {
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
    addCustomTokenInfo: (state, action: PayloadAction<TokenInfo>) => {
      state.customTokens[action.payload.address] = action.payload;
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
      .addCase(fetchAllTokens.pending, (state): MetadataState => {
        return {
          ...state,
          isFetchingAllTokens: true,
        };
      })
      .addCase(fetchAllTokens.fulfilled, (state, action): MetadataState => {
        return {
          ...state,
          isFetchingAllTokens: false,
          knownTokens: action.payload,
        };
      })
      .addCase(fetchAllTokens.rejected, (state): MetadataState => {
        return {
          ...state,
          isFetchingAllTokens: false,
        };
      })
      .addCase(fetchSupportedTokens.fulfilled, (state, action) => {
        if (state.tokens.active.length) {
          return state;
        }

        return {
          ...state,
          tokens: {
            ...state.tokens,
            active: action.payload.activeTokens || [],
          },
        };
      })
      .addCase(fetchUnkownTokens.fulfilled, (state, action) => {
        return {
          ...state,
          unknownTokens: action.payload,
        };
      })
      .addCase(fetchProtocolFee.fulfilled, (state, action) => {
        return {
          ...state,
          protocolFee: action.payload,
        };
      })
      .addCase(walletChanged, (state): MetadataState => {
        return {
          ...state,
          tokens: {
            active: [],
            custom: [],
          },
        };
      })
      .addCase(chainIdChanged, (state): MetadataState => {
        return {
          ...state,
          tokens: {
            active: [],
            custom: [],
          },
        };
      })
      .addCase(walletDisconnected, (): MetadataState => {
        return initialState;
      });
  },
});

export const {
  addActiveToken,
  addCustomToken,
  addCustomTokenInfo,
  removeActiveToken,
  removeCustomToken,
  setTokens,
} = metadataSlice.actions;

export const selectActiveTokenAddresses = (state: RootState) =>
  state.metadata.tokens.active;
export const selectCustomTokenAddresses = (state: RootState) =>
  state.metadata.tokens.custom;
export const selectAllTokens = (state: RootState) => [
  ...Object.values(state.metadata.customTokens),
  ...Object.values(state.metadata.knownTokens),
  ...Object.values(state.metadata.unknownTokens),
];
export const selectAllTokenInfo = createSelector(
  [selectAllTokens, selectChainId],
  (allTokenInfo, chainId) => {
    return allTokenInfo.filter((tokenInfo) => tokenInfo.chainId === chainId);
  }
);
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
