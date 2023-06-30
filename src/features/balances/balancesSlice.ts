import { WETH } from "@airswap/libraries";
import {
  AsyncThunk,
  combineReducers,
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { BigNumber, ethers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { nativeCurrencyAddress } from "../../constants/nativeCurrency";
import getWethAddress from "../../helpers/getWethAddress";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import {
  fetchAllowancesSwap,
  fetchAllowancesWrapper,
  fetchBalances,
} from "./balancesApi";

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
export const initialState: BalancesState = {
  status: "idle",
  lastFetch: null,
  inFlightFetchTokens: null,
  values: {},
};

const getSetInFlightRequestTokensAction = (
  type: "balances" | "allowances.swap" | "allowances.wrapper"
) => {
  return createAction<string[]>(`${type}/setInFlightRequestTokens`);
};

const getThunk: (
  type: "balances" | "allowances.swap" | "allowances.wrapper"
) => AsyncThunk<
  { address: string; amount: string }[],
  {
    provider: ethers.providers.Web3Provider;
  },
  {}
> = (type: "balances" | "allowances.swap" | "allowances.wrapper") => {
  const methods = {
    balances: fetchBalances,
    "allowances.swap": fetchAllowancesSwap,
    "allowances.wrapper": fetchAllowancesWrapper,
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
        const { chainId, address } = state.wallet;

        const wrappedNativeCurrencyAddress = chainId
          ? getWethAddress(chainId)
          : undefined;
        const activeTokensAddresses = [
          ...state.metadata.tokens.active,
          ...state.metadata.tokens.custom,
          ...(wrappedNativeCurrencyAddress
            ? [wrappedNativeCurrencyAddress]
            : []),
          nativeCurrencyAddress,
        ];
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
      } catch (e: any) {
        console.error(`Error fetching ${type}: ` + e.message);
        throw e;
      }
    },
    {
      // Logic to prevent fetching again if we're already fetching the same or more tokens.
      condition: (params, { getState }) => {
        const pathParts = type.split(".");
        const sliceState =
          pathParts.length > 1
            ? // @ts-ignore
              getState()[pathParts[0]][pathParts[1]]
            : // @ts-ignore
              getState()[type];
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
  type: "balances" | "allowances.swap" | "allowances.wrapper",
  asyncThunk: ReturnType<typeof getThunk>
) => {
  return createSlice({
    name: type,
    initialState,
    reducers: {
      incrementBy: (
        state,
        action: PayloadAction<{ tokenAddress: string; amount: string }>
      ) => {
        const currentAmount = BigNumber.from(
          state.values[action.payload.tokenAddress.toLowerCase()] || 0
        );
        state.values[action.payload.tokenAddress.toLowerCase()] = currentAmount
          .add(action.payload.amount)
          .toString();
      },
      decrementBy: (
        state,
        action: PayloadAction<{ tokenAddress: string; amount: string }>
      ) => {
        const currentAmount = BigNumber.from(
          state.values[action.payload.tokenAddress.toLowerCase()] || 0
        );
        let newAmount = currentAmount.sub(action.payload.amount);
        if (newAmount.lt("0")) newAmount = BigNumber.from("0");
        state.values[action.payload.tokenAddress.toLowerCase()] =
          newAmount.toString();
      },
      set: (
        state,
        action: PayloadAction<{ tokenAddress: string; amount: string }>
      ) => {
        state.values[action.payload.tokenAddress.toLowerCase()] =
          action.payload.amount;
      },
    },
    extraReducers: (builder) => {
      builder
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
        })
        .addCase(setWalletConnected, () => initialState)
        .addCase(setWalletDisconnected, () => initialState);
    },
  });
};

export const selectBalances = (state: RootState) => state.balances;
export const selectAllowances = (state: RootState) => state.allowances;
export const selectAllowancesSwap = (state: RootState) => state.allowances.swap;
export const selectAllowancesWrapper = (state: RootState) =>
  state.allowances.wrapper;

export const requestActiveTokenBalances = getThunk("balances");
export const requestActiveTokenAllowancesSwap = getThunk("allowances.swap");
export const requestActiveTokenAllowancesWrapper =
  getThunk("allowances.wrapper");

export const balancesSlice = getSlice("balances", requestActiveTokenBalances);
export const allowancesSwapSlice = getSlice(
  "allowances.swap",
  requestActiveTokenAllowancesSwap
);
export const allowancesWrapperSlice = getSlice(
  "allowances.wrapper",
  requestActiveTokenAllowancesWrapper
);

export const {
  incrementBy: incrementBalanceBy,
  decrementBy: decrementBalanceBy,
  set: setBalance,
} = balancesSlice.actions;
export const {
  incrementBy: incrementAllowanceSwapBy,
  decrementBy: decrementAllowanceSwapBy,
  set: setAllowanceSwap,
} = allowancesSwapSlice.actions;
export const {
  incrementBy: incrementAllowanceWrapperBy,
  decrementBy: decreementAllowanceWrapperBy,
  set: setAllowanceWrapper,
} = allowancesWrapperSlice.actions;

export const balancesActions = balancesSlice.actions;
export const allowancesSwapActions = allowancesSwapSlice.actions;
export const allowancesWrapperActions = allowancesWrapperSlice.actions;

export const balancesReducer = balancesSlice.reducer;
export const allowancesSwapReducer = allowancesSwapSlice.reducer;
export const allowancesWrapperReducer = allowancesWrapperSlice.reducer;
export const allowancesReducer = combineReducers({
  swap: allowancesSwapReducer,
  wrapper: allowancesWrapperReducer,
});
