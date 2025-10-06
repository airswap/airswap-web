import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppTokenInfo } from "../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenId,
  isTokenInfo,
  splitTokenIdentifier,
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
        activeTokens: action.payload
          .slice()
          .sort(sortTokensById)
          .map((token) => token.toLowerCase()),
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

const sortTokensById = (a: string, b: string) => {
  const { address: aAddress, id: aId } = splitTokenIdentifier(a);
  const { address: bAddress, id: bId } = splitTokenIdentifier(b);

  if (aAddress === bAddress && aId && bId) {
    return Number(aId) - Number(bId);
  }

  return aAddress.localeCompare(bAddress);
};

const sortTokenInfosById = (a: AppTokenInfo, b: AppTokenInfo) => {
  return sortTokensById(getTokenId(a), getTokenId(b));
};

export const { setActiveTokens, setUnknownTokens } = metadataSlice.actions;

export const selectActiveTokenAddresses = (state: RootState) =>
  state.metadata.activeTokens;
export const selectAllTokens = (state: RootState) =>
  [
    ...Object.values(state.metadata.knownTokens),
    ...Object.values(state.metadata.unknownTokens),
  ].sort(sortTokenInfosById);
export const selectAllTokenInfo = createSelector(
  [selectAllTokens, selectChainId],
  (allTokenInfo, chainId) => {
    return allTokenInfo.filter((tokenInfo) => tokenInfo.chainId === chainId);
  }
);
export const selectErc20Tokens = createSelector(
  [selectAllTokenInfo],
  (allTokenInfo) => {
    return allTokenInfo.filter(isTokenInfo).sort(sortTokenInfosById);
  }
);
export const selectActiveTokens = createSelector(
  [selectActiveTokenAddresses, selectAllTokenInfo],
  (activeTokenAddresses, allTokenInfo) => {
    return Object.values(allTokenInfo)
      .filter((tokenInfo) =>
        activeTokenAddresses.includes(getTokenId(tokenInfo))
      )
      .sort(sortTokenInfosById);
  }
);
export const selectActiveErc20Tokens = createSelector(
  [selectActiveTokens],
  (activeTokens) => {
    return activeTokens.filter(isTokenInfo).sort(sortTokenInfosById);
  }
);
export const selectMetaDataReducer = (state: RootState) => state.metadata;
export const selectProtocolFee = (state: RootState) =>
  state.metadata.protocolFee;

export default metadataSlice.reducer;
