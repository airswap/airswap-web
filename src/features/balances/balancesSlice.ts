import { ethers } from "ethers";
import {
  AsyncThunk,
  createAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { fetchAllowances, fetchBalances } from "./balancesApi";
import { AppDispatch, RootState } from "../../app/store";
import { setWalletConnected } from "../wallet/walletSlice";

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

const getSetInFlightRequestTokensAction = (type: "balances" | "allowances") => {
  return createAction<string[]>(`${type}/setInFlightRequestTokens`);
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
    `${type}/requestForActiveTokens`,
    async (params, { getState, dispatch }) => {
      try {
        const activeTokensAddresses = getState().metadata.tokens.active;
        dispatch(
          getSetInFlightRequestTokensAction(type)(activeTokensAddresses)
        );
        const amounts = await methods[type]({
          ...params,
          chainId: params.chainId,
          tokenAddresses: activeTokensAddresses,
        });
        return activeTokensAddresses.map((address, i) => ({
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
      condition: (params, { getState }) => {
        const sliceState = getState()[type];
        // If we're not fetching, definitely continue
        if (sliceState.status !== "fetching") return true;
        if (sliceState.inFlightFetchTokens) {
          const tokensToFetch = getState().metadata.tokens.active;
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
        .addCase(setWalletConnected, () => initialState)

        // Handle requesting balances
        .addCase(asyncThunk.pending, (state) => {
          state.status = "fetching";
        })
        .addCase(getSetInFlightRequestTokensAction(type), (state, action) => {
          state.inFlightFetchTokens = action.payload;
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

export const requestSavedActiveTokensBalances = getThunk("balances");
export const requestSavedActiveTokensAllowances = getThunk("allowances");

export const balancesSlice = getSlice(
  "balances",
  requestSavedActiveTokensBalances
);
export const allowancesSlice = getSlice(
  "allowances",
  requestSavedActiveTokensAllowances
);

export const balancesReducer = balancesSlice.reducer;
export const allowancesReducer = allowancesSlice.reducer;
