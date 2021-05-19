import { ethers } from "ethers";
import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllowances,
  fetchBalances,
  getSavedTokenSet,
} from "./balancesApi";
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

const getThunk: (type: "balances" | "allowances") => AsyncThunk<
  { address: string; amount: string }[],
  {
    chainId: number;
    provider: ethers.providers.Web3Provider;
    walletAddress: string;
  },
  {}
> = (type: "balances" | "allowances") => {
  const methods = {
    balances: fetchBalances,
    allowances: fetchAllowances,
  };
  return createAsyncThunk<
    { address: string; amount: string }[],
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
    `${type}/requestForSavedTokenSet`,
    async (params) => {
      try {
        const tokenSetAddresses = getSavedTokenSet(params.chainId);
        const amounts = await methods[type]({
          ...params,
          chainId: params.chainId,
          tokenAddresses: tokenSetAddresses,
        });
        return tokenSetAddresses.map((address, i) => ({
          address,
          amount: amounts[i],
        }));
      } catch (e) {
        console.error(`Error fetching ${type}: ` + e.message);
        // TODO: error handling
        return [];
      }
    },
    {
      // Logic to prevent fetching again if we're already fetching the same or more tokens.
      condition: (params, { getState, extra }) => {
        const sliceState = getState()[type];
        // If we're not fetching, definitely continue
        if (sliceState.status !== "fetching") return true;
        if (sliceState.inFlightFetchTokens) {
          const tokensToFetch = getSavedTokenSet(params.chainId);
          // only fetch if new list is larger.
          return tokensToFetch.length > sliceState.inFlightFetchTokens.length;
        }
      },
    }
  );
};

const getSlice = (
  type: "balances" | "allowances",
  asyncThunk: ReturnType<typeof getThunk>
) => {
  return createSlice({
    name: type,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Reset to initial state if a new account is connected.
        .addCase(walletConnected, () => initialState)

        // Handle requesting balances
        .addCase(asyncThunk.pending, (state, action) => {
          state.status = "fetching";
          state.inFlightFetchTokens = getSavedTokenSet(action.meta.arg.chainId);
        })
        .addCase(asyncThunk.fulfilled, (state, action) => {
          state.lastFetch = Date.now();
          const tokenBalances = action.payload;

          tokenBalances?.forEach(({ address, amount }) => {
            state.values[address] = amount;
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
        .addCase(asyncThunk.rejected, (state, action) => {
          state.status = "failed";
        });
    },
  });
};

export const selectBalances = (state: RootState) => state.balances;
export const selectAllowances = (state: RootState) => state.allowances;

export const requestSavedTokenSetBalances = getThunk("balances");
export const requestSavedTokenSetAllowances = getThunk("allowances");

export const balancesSlice = getSlice("balances", requestSavedTokenSetBalances);
export const allowancesSlice = getSlice(
  "allowances",
  requestSavedTokenSetAllowances
);

export const balancesReducer = balancesSlice.reducer;
export const allowancesReducer = allowancesSlice.reducer;
