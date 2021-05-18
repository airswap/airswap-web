import { ethers } from "ethers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBalances, getSavedTokenSetInfo } from "./balancesApi";
import { RootState } from "../../app/store";
import { walletConnected } from "../wallet/walletActions";

export interface BalancesState {
  status: "idle" | "fetching" | "failed";
  lastFetch: number | null;
  values: {
    [tokenAddress: string]: string | null; // null while fetching
  };
}

// TODO: initialise all when token list is selected.

// Initially empty.
const initialState: BalancesState = {
  status: "idle",
  lastFetch: null,
  values: {},
};

// export const requestBalances = createAsyncThunk(
//   "balances/requestSpecific",
//   async (params: {
//     tokenAddresses: string[];
//     chainId: "1" | "4" | "5" | "42";
//     provider: ethers.providers.Web3Provider;
//     walletAddress: string;
//   }) => {
//     return await fetchBalances({
//       ...params,
//     });
//   }
// );

export const requestSavedTokenSetBalances = createAsyncThunk(
  "balances/requestForSavedTokenSet",
  async (
    params: {
      chainId: number;
      provider: ethers.providers.Web3Provider;
      walletAddress: string;
    },
    thunkApi
  ) => {
    // TODO: prevent dupe fetches?
    try {
      const tokenSetAddresses = (
        await getSavedTokenSetInfo(params.chainId)
      ).map((tokenInfo) => tokenInfo.address);
      const balances = await fetchBalances({
        ...params,
        chainId: String(params.chainId) as "1" | "4" | "5" | "42",
        tokenAddresses: tokenSetAddresses,
      });
      return tokenSetAddresses.map((address, i) => ({
        address,
        balance: balances[i],
      }));
    } catch (e) {
      console.log(e);
      // TODO: error handling
    }
  }
);

export const balancesSlice = createSlice({
  name: "balances",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reset to initial state if a new account is connected.
      .addCase(walletConnected, () => initialState)

      // These are probably going to be removed.
      // .addCase(requestBalances.pending, (state, action) => {
      //   state.status = "fetching";
      //   // Just started fetching, set token balances to `null` to indicate this
      //   const tokens = action.meta.arg.tokenAddresses;
      //   tokens.forEach((tokenAddress) => {
      //     state.values[tokenAddress] = state.values[tokenAddress] || null;
      //   });
      // })
      // .addCase(requestBalances.fulfilled, (state, action) => {
      //   state.status = "idle";
      //   state.lastFetch = Date.now();
      //   const tokens = action.meta.arg.tokenAddresses;
      //   const balances = action.payload;
      //   tokens.forEach((tokenAddress, i) => {
      //     state.values[tokenAddress] = balances[i];
      //   });
      // })
      // .addCase(requestBalances.rejected, (state, action) => {
      //   state.status = "failed";
      // })

      // Handle requesting balances
      .addCase(requestSavedTokenSetBalances.pending, (state, action) => {
        state.status = "fetching";
      })
      .addCase(requestSavedTokenSetBalances.fulfilled, (state, action) => {
        state.status = "idle";
        state.lastFetch = Date.now();
        const tokenBalances = action.payload;
        tokenBalances?.forEach(({ address, balance }) => {
          state.values[address] = balance;
        });
      })
      .addCase(requestSavedTokenSetBalances.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const selectBalances = (state: RootState) => state.balances;

export default balancesSlice.reducer;
