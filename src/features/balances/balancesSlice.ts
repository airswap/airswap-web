import { BigNumber, ethers } from "ethers";
import {
  AsyncThunk,
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { fetchAllowances, fetchBalances } from "./balancesApi";
import { AppDispatch, RootState } from "../../app/store";
import { setWalletConnected } from "../wallet/walletSlice";
import { stakingTokenAddresses } from "@airswap/constants";

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
    provider: ethers.providers.Web3Provider;
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
      provider: ethers.providers.Web3Provider;
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
        const state = getState();
        const activeTokensAddresses = state.metadata.tokens.active;
        const { chainId, address } = state.wallet;
        dispatch(
          getSetInFlightRequestTokensAction(type)(activeTokensAddresses)
        );
        const amounts = await methods[type]({
          ...params,
          chainId: chainId!,
          walletAddress: address!,
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
    reducers: {
      incrementBy: (
        state,
        action: PayloadAction<{ tokenAddress: string; amount: BigNumber }>
      ) => {
        const currentAmount = BigNumber.from(
          state.values[action.payload.tokenAddress] || 0
        );
        state.values[action.payload.tokenAddress] = currentAmount
          .add(action.payload.amount)
          .toString();
      },
      decrementBy: (
        state,
        action: PayloadAction<{ tokenAddress: string; amount: BigNumber }>
      ) => {
        const currentAmount = BigNumber.from(
          state.values[action.payload.tokenAddress] || 0
        );
        state.values[action.payload.tokenAddress] = currentAmount
          .sub(action.payload.amount)
          .toString();
      },
    },
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

export const requestActiveTokenBalances = getThunk("balances");
export const requestActiveTokenAllowances = getThunk("allowances");

export const balancesSlice = getSlice("balances", requestActiveTokenBalances);
export const allowancesSlice = getSlice(
  "allowances",
  requestActiveTokenAllowances
);

export const {
  incrementBy: incrementBalanceBy,
  decrementBy: decrementBalanceBy,
} = balancesSlice.actions;
export const {
  incrementBy: incrementAllowanceBy,
  decrementBy: decreementAllowanceBy,
} = allowancesSlice.actions;

export const balancesReducer = balancesSlice.reducer;
export const allowancesReducer = allowancesSlice.reducer;
