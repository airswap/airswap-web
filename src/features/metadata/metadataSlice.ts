import { TokenInfo } from "@airswap/utils";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { getUniqueSingleDimensionArray } from "../../helpers/array";
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

export type MetadataTokenInfoMap = {
  [address: string]: TokenInfo;
};

export interface MetadataState {
  isFetchingAllTokens: boolean;
  isFetchingAllTokensSuccess: boolean;
  knownTokens: MetadataTokenInfoMap;
  unknownTokens: MetadataTokenInfoMap;
  protocolFee: number;
  activeTokens: string[];
}

const initialState: MetadataState = {
  isFetchingAllTokens: false,
  isFetchingAllTokensSuccess: false,
  knownTokens: {},
  unknownTokens: {},
  protocolFee: 0,
  activeTokens: [],
};

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setActiveTokens: (state, action: PayloadAction<string[]>) => {
      return {
        ...state,
        isInitialized: true,
        activeTokens: action.payload.map((token) => token.toLowerCase()),
      };
    },
    setUnknownTokens: (state, action: PayloadAction<MetadataTokenInfoMap>) => {
      return {
        ...state,
        unknownTokens: action.payload,
      };
    },
  },
  extraReducers: async (builder) => {
    builder
      .addCase(fetchAllTokens.pending, (state): MetadataState => {
        return {
          ...state,
          isFetchingAllTokens: true,
          isFetchingAllTokensSuccess: false,
        };
      })
      .addCase(fetchAllTokens.fulfilled, (state, action): MetadataState => {
        return {
          ...state,
          isFetchingAllTokens: false,
          isFetchingAllTokensSuccess: true,
          knownTokens: {
            ...state.knownTokens,
            ...action.payload,
          },
        };
      })
      .addCase(fetchAllTokens.rejected, (state): MetadataState => {
        return {
          ...state,
          isFetchingAllTokens: false,
        };
      })
      .addCase(fetchUnkownTokens.fulfilled, (state, action) => {
        return {
          ...state,
          unknownTokens: {
            ...state.unknownTokens,
            ...action.payload,
          },
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
          activeTokens: [],
        };
      })
      .addCase(chainIdChanged, (state): MetadataState => {
        return {
          ...state,
          knownTokens: {},
          unknownTokens: {},
          activeTokens: [],
        };
      })
      .addCase(walletDisconnected, (): MetadataState => {
        return initialState;
      });
  },
});

export const { setActiveTokens, setUnknownTokens } = metadataSlice.actions;

export const selectActiveTokenAddresses = (state: RootState) =>
  state.metadata.activeTokens;
export const selectAllTokens = (state: RootState) => [
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
export const selectMetaDataReducer = (state: RootState) => state.metadata;
export const selectProtocolFee = (state: RootState) =>
  state.metadata.protocolFee;

export default metadataSlice.reducer;
