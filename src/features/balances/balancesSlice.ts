import { ethers } from "ethers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBalances } from "./balancesApi";
import { RootState } from "../../app/store";

export interface BalancesState {
  [tokenAddress: string]: {
    balanceStatus: "idle" | "fetching" | "fetched" | "subscribed" | "error";
    lastBalanceFetch?: number;
    allowanceStatus: "idle" | "fetching" | "fetched" | "subscribed" | "error";
    balance: string;
    allowance: {
      [spender: string]: string;
    };
  };
}

// TODO: initialise all when token list is selected.

// Initially empty.
const initialState: BalancesState = {};

export const requestBalances = createAsyncThunk(
  "balances/request",
  async (params: {
    tokenAddresses: string[];
    chainId: "1" | "4" | "5" | "42";
    provider: ethers.providers.Web3Provider;
    walletAddress: string;
  }) => {
    return await fetchBalances({
      ...params,
    });
  }
);

export const balancesSlice = createSlice({
  name: "balances",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestBalances.pending, (state, action) => {
        const tokens = action.meta.arg.tokenAddresses;
        tokens.forEach((tokenAddress) => {
          state[tokenAddress] = {
            ...state[tokenAddress],
            balanceStatus: "fetching",
            balance: "0",
          };
        });
      })
      .addCase(requestBalances.fulfilled, (state, action) => {
        const tokens = action.meta.arg.tokenAddresses;
        const balances = action.payload;
        tokens.forEach((tokenAddress, i) => {
          const tokenState = state[tokenAddress];
          tokenState.balanceStatus = "fetched";
          tokenState.lastBalanceFetch = Date.now();
          tokenState.balance = balances[i];
        });
      })
      .addCase(requestBalances.rejected, (state, action) => {
        console.log(action.error);
        const tokens = action.meta.arg.tokenAddresses;
        tokens.forEach((tokenAddress) => {
          const tokenState = state[tokenAddress];
          tokenState.balanceStatus = "error";
        });
      });
  },
});

export const selectBalances = (state: RootState) => state.balances;

export default balancesSlice.reducer;
