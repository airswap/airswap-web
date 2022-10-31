import { fetchTokens } from "@airswap/metadata";
import { TokenInfo } from "@airswap/typescript";
import { Web3Provider } from "@ethersproject/providers";
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
  getProtocolFee,
  getUnknownTokens,
} from "./metadataApi";

export interface MetadataState {
  isFetchingAllTokens: boolean;
  protocolFee: number;
  tokens: {
    all: {
      [address: string]: TokenInfo;
    };
    active: string[];
  };
}

const initialState: MetadataState = {
  isFetchingAllTokens: false,
  protocolFee: 7,
  tokens: {
    all: {},
    active: [],
  },
};

export const fetchAllTokens = createAsyncThunk<
  TokenInfo[], // Return type
  number, // First argument
  {
    // thunkApi
    dispatch: AppDispatch;
    state: RootState;
  }
>("metadata/fetchTokens", async (chainId, thunkApi) => {
  return (await fetchTokens(chainId)).tokens;
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

export const fetchProtocolFee = createAsyncThunk<
  number,
  {
    provider: Web3Provider;
    chainId: number;
  }
>("metadata/fetchProtocolFee", async ({ provider, chainId }) => {
  try {
    return getProtocolFee(chainId, provider);
  } catch {
    console.error("Error getting protocol fee from contract, defaulting to 7.");
    return 7;
  }
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
        const all = tokenInfo.reduce(
          (allTokens: { [address: string]: TokenInfo }, token) => {
            const { address } = token;
            if (!allTokens[address]) {
              allTokens[address] = { ...token };
            }
            return allTokens;
          },
          {}
        );

        const tokens = {
          ...state.tokens,
          all,
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
export const selectMetaDataReducer = (state: RootState) => state.metadata;
export const selectProtocolFee = (state: RootState) =>
  state.metadata.protocolFee;

export default metadataSlice.reducer;
