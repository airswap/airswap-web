import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenId,
  isCollectionTokenInfo,
  isTokenInfo,
} from "../../entities/AppTokenInfo/AppTokenInfoHelpers";
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
  [address: string]: AppTokenInfo;
};

export interface MetadataState {
  isFetchingAllTokens: boolean;
  isFetchingAllTokensSuccess: boolean;
  knownTokens: MetadataTokenInfoMap;
  unknownTokens: MetadataTokenInfoMap;
  protocolFee: number;
  // Active tokens are used on the base side of the quote
  activeTokens: string[];
  // Quote tokens are used on the quote side of the quote
  quoteTokens: string[];
}

const initialState: MetadataState = {
  isFetchingAllTokens: false,
  isFetchingAllTokensSuccess: false,
  knownTokens: {},
  unknownTokens: {},
  protocolFee: 0,
  activeTokens: [],
  quoteTokens: [],
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
    setQuoteTokens: (state, action: PayloadAction<string[]>) => {
      return {
        ...state,
        quoteTokens: action.payload.map((token) => token.toLowerCase()),
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

export const { setActiveTokens, setUnknownTokens, setQuoteTokens } =
  metadataSlice.actions;

export const selectActiveTokenAddresses = (state: RootState) =>
  state.metadata.activeTokens;
export const selectQuoteTokenAddresses = (state: RootState) =>
  state.metadata.quoteTokens;
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
export const selectErc20Tokens = createSelector(
  [selectAllTokenInfo],
  (allTokenInfo) => {
    return allTokenInfo.filter(isTokenInfo);
  }
);
export const selectActiveTokens = createSelector(
  [selectActiveTokenAddresses, selectAllTokenInfo],
  (activeTokenAddresses, allTokenInfo) => {
    return Object.values(allTokenInfo).filter((tokenInfo) =>
      activeTokenAddresses.includes(getTokenId(tokenInfo))
    );
  }
);
export const selectActiveErc20Tokens = createSelector(
  [selectActiveTokens],
  (activeTokens) => {
    return activeTokens.filter(isTokenInfo);
  }
);
export const selectQuoteTokens = createSelector(
  [selectQuoteTokenAddresses, selectAllTokenInfo],
  (quoteTokenAddresses, allTokenInfo) => {
    return Object.values(allTokenInfo).filter((tokenInfo) =>
      quoteTokenAddresses.includes(getTokenId(tokenInfo))
    );
  }
);
export const selectQuoteErc20Tokens = createSelector(
  [selectQuoteTokens],
  (quoteTokens) => {
    return quoteTokens.filter(isTokenInfo);
  }
);
export const selectMetaDataReducer = (state: RootState) => state.metadata;
export const selectProtocolFee = (state: RootState) =>
  state.metadata.protocolFee;

export default metadataSlice.reducer;
