import { OrderERC20 } from "@airswap/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { AppError } from "../../errors/appError";
import { walletDisconnected } from "../web3/web3Actions";
import { orderSortingFunction } from "./ordersHelpers";

export interface OrdersState {
  orders: OrderERC20[];
  status: "idle" | "requesting" | "signing" | "failed" | "reset";
  reRequestTimerId: number | null;
  errors: AppError[];
}

const initialState: OrdersState = {
  orders: [],
  status: "idle",
  reRequestTimerId: null,
  errors: [],
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<OrdersState["status"]>) => {
      state.status = action.payload;
    },
    setResetStatus: (state) => {
      state.status = "reset";
    },
    setErrors: (state, action: PayloadAction<AppError[]>) => {
      state.errors = action.payload;
    },
    clear: (state) => {
      state.orders = [];
      state.status = "idle";
      state.errors = [];
      if (state.reRequestTimerId) {
        clearTimeout(state.reRequestTimerId);
        state.reRequestTimerId = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(walletDisconnected, (): OrdersState => {
      return initialState;
    });
  },
});

export const { clear, setErrors, setResetStatus, setStatus } =
  ordersSlice.actions;
/**
 * Sorts orders and returns the best order based on tokens received or sent
 * then falling back to expiry.
 */
export const selectBestOrder = (state: RootState): OrderERC20 | undefined =>
  // Note that `.sort` mutates the array, so we need to clone it first to
  // prevent mutating state.
  [...state.orders.orders].sort(orderSortingFunction)[0];

export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectOrdersErrors = (state: RootState) => state.orders.errors;

export default ordersSlice.reducer;
