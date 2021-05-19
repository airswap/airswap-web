import { ethers } from "ethers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBalances, getSavedTokenSet } from "./balancesApi";
import { AppDispatch, RootState } from "../../app/store";
import { walletConnected } from "../wallet/walletActions";

export interface BalancesState {
  status: "idle" | "fetching" | "failed";
  /** Timestamp of last successful fetch */
  lastFetch: number | null;
  /** An array of token addresses currently being fetched. If there are two
   * fetches in flight, this array will contain the list of addresses in the
   * largest request.
   */
  inFlightFetchTokens: string[] | null; // used to prevent duplicate fetches
  /** Token balances */
  values: {
    [tokenAddress: string]: string | null; // null while fetching
  };
}

// Initially empty.
const initialState: BalancesState = {
  status: "idle",
  lastFetch: null,
  inFlightFetchTokens: null,
  values: {},
};

export const requestSavedTokenSetBalances = createAsyncThunk<
  { address: string; balance: string }[],
  {
    chainId: number;
    provider: ethers.providers.Web3Provider;
    walletAddress: string;
  },
  {
    // Optional fields for defining thunkApi field types
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  "balances/requestForSavedTokenSet",
  async (params) => {
    // TODO: prevent dupe fetches?
    try {
      const tokenSetAddresses = getSavedTokenSet(params.chainId);
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
      console.error("Error fetching balances: " + e.message);
      // TODO: error handling
      return [];
    }
  },
  {
    // Logic to prevent fetching again if we're already fetching the same or more tokens.
    condition: (params, { getState, extra }) => {
      const { balances } = getState();
      // If we're not fetching, definitely continue
      if (balances.status !== "fetching") return true;
      if (balances.inFlightFetchTokens) {
        const tokensToFetch = getSavedTokenSet(params.chainId);
        // only fetch if new list is larger.
        return tokensToFetch.length > balances.inFlightFetchTokens.length;
      }
    },
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

      // Handle requesting balances
      .addCase(requestSavedTokenSetBalances.pending, (state, action) => {
        state.status = "fetching";
        state.inFlightFetchTokens = getSavedTokenSet(action.meta.arg.chainId);
      })
      .addCase(requestSavedTokenSetBalances.fulfilled, (state, action) => {
        state.lastFetch = Date.now();
        const tokenBalances = action.payload;

        tokenBalances?.forEach(({ address, balance }) => {
          state.values[address] = balance;
        });

        // Only clear fetching status if this request contained the largest
        // list of tokens (which will be stored in inFlightFetchTokens)
        if (
          state.inFlightFetchTokens &&
          tokenBalances.every(
            (result, i) => state.inFlightFetchTokens![i] === result.address
          )
        ) {
          state.inFlightFetchTokens = null;
          state.status = "idle";
        }
      })
      .addCase(requestSavedTokenSetBalances.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const selectBalances = (state: RootState) => state.balances;

export default balancesSlice.reducer;
