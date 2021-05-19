import { LightOrder } from "@airswap/types";
import { Transaction } from "@ethersproject/transactions";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { requestOrder, takeOrder, approveToken } from "./orderAPI";

export interface OrdersState {
  orders: LightOrder[];
  tx: null | Transaction;
  status: "idle" | "requesting" | "taking" | "failed";
}

const initialState: OrdersState = {
  orders: [],
  tx: null,
  status: "idle",
};

export const request = createAsyncThunk(
  "orders/request",
  async (params: {
    chainId: number;
    signerToken: string;
    senderToken: string;
    senderAmount: string;
    senderWallet: string;
    provider: any;
  }) =>
    await requestOrder(
      params.chainId,
      params.signerToken,
      params.senderToken,
      params.senderAmount,
      params.senderWallet,
      params.provider
    )
);

export const approve = createAsyncThunk(
  "orders/approve",
  async (params: any) => await approveToken(params.token, params.library)
);

export const take = createAsyncThunk(
  "orders/take",
  async (params: any) => await takeOrder(params.order, params.library)
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clear: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(request.pending, (state) => {
        state.status = "requesting";
      })
      .addCase(request.fulfilled, (state, action) => {
        state.status = "idle";
        state.orders = action.payload!;
      })
      .addCase(take.pending, (state) => {
        state.status = "taking";
      })
      .addCase(take.fulfilled, (state, action) => {
        state.status = "idle";
        state.tx = action.payload!;
      });
  },
});

export const { clear } = ordersSlice.actions;

export const selectOrder = (state: RootState) => state.orders.orders[0];
export const selectTX = (state: RootState) => state.orders.tx;

export default ordersSlice.reducer;
