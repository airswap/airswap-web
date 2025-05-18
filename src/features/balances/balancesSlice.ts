import { combineReducers, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BigNumber } from "ethers";

import { RootState } from "../../app/store";
import { walletChanged, walletDisconnected } from "../web3/web3Actions";
import { getThunk, getSetInFlightRequestTokensAction } from "./balancesApi";

export type BalanceValues = {
  [tokenId: string]: string | null; // null while fetching
};

export interface BalancesState {
  status: "idle" | "fetching" | "failed";
  /** Timestamp of last successful fetch */
  lastFetch: number | null;
  /** An array of token addresses currently being fetched. If there are two
   * fetches in flight, this array will contain the list of addresses in the
   * largest request.
   */
  inFlightFetchTokens: string[] | null; // used to prevent duplicate fetches
  /** Token balances, where the key is the tokenId (e.g. "0x1234567890123456789012345678901234567890"
   * for ERC-20 and "0x1234567890123456789012345678901234567890-1" for ERC-721) */
  values: BalanceValues;
}

// Initially empty.
export const initialState: BalancesState = {
  status: "idle",
  lastFetch: null,
  inFlightFetchTokens: null,
  values: {},
};

interface TokenBalance {
  address: string;
  amount: string;
}

const getSlice = (
  type:
    | "balances"
    | "allowances.swap"
    | "allowances.swapERC20"
    | "allowances.wrapper"
    | "allowances.delegate",
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
          const tokenBalances = action.payload as TokenBalance[];

          tokenBalances?.forEach(({ address, amount }: TokenBalance) => {
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
        .addCase(walletDisconnected, (): BalancesState => {
          return initialState;
        })
        .addCase(walletChanged, (state): BalancesState => {
          const keys = Object.keys(state.values);
          const values = keys.reduce((acc, key) => {
            return { ...acc, [key]: "0" };
          }, {});

          return {
            ...state,
            values,
          };
        });
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
export const requestActiveTokenAllowancesSwapERC20 = getThunk(
  "allowances.swapERC20"
);
export const requestActiveTokenAllowancesWrapper =
  getThunk("allowances.wrapper");
export const requestActiveTokenAllowancesDelegate = getThunk(
  "allowances.delegate"
);

export const balancesSlice = getSlice("balances", requestActiveTokenBalances);
export const allowancesSwapSlice = getSlice(
  "allowances.swap",
  requestActiveTokenAllowancesSwap
);
export const allowancesSwapERC20Slice = getSlice(
  "allowances.swapERC20",
  requestActiveTokenAllowancesSwapERC20
);
export const allowancesWrapperSlice = getSlice(
  "allowances.wrapper",
  requestActiveTokenAllowancesWrapper
);
export const allowancesDelegateSlice = getSlice(
  "allowances.delegate",
  requestActiveTokenAllowancesDelegate
);

export const balancesActions = balancesSlice.actions;
export const allowancesSwapActions = allowancesSwapSlice.actions;
export const allowancesSwapERC20Actions = allowancesSwapERC20Slice.actions;
export const allowancesWrapperActions = allowancesWrapperSlice.actions;
export const allowancesDelegateActions = allowancesDelegateSlice.actions;
export const balancesReducer = balancesSlice.reducer;
export const allowancesSwapReducer = allowancesSwapSlice.reducer;
export const allowancesSwapERC20Reducer = allowancesSwapERC20Slice.reducer;
export const allowancesWrapperReducer = allowancesWrapperSlice.reducer;
export const allowancesDelegateReducer = allowancesDelegateSlice.reducer;
export const allowancesReducer = combineReducers({
  swap: allowancesSwapReducer,
  swapERC20: allowancesSwapERC20Reducer,
  wrapper: allowancesWrapperReducer,
  delegate: allowancesDelegateReducer,
});
