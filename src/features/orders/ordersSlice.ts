import { LightOrder } from "@airswap/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { requestOrder, takeOrder, approveToken } from "./orderAPI";
import {
  submitTransaction,
  mineTransaction,
  revertTransaction,
  declineTransaction,
} from "../transactions/transactionActions";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import { Transaction } from "ethers";

export interface OrdersState {
  orders: LightOrder[];
  status: "idle" | "requesting" | "taking" | "failed";
}

const initialState: OrdersState = {
  orders: [],
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
  async (params: any, { dispatch }) => {
    let tx: Transaction;
    try {
      tx = await takeOrder(params.order, params.library);
      if (tx.hash) {
        dispatch(
          submitTransaction({
            order: params.order,
            hash: tx.hash,
            status: "processing",
          })
        );
        params.library.once(tx.hash, async () => {
          const receipt = await params.library.getTransactionReceipt(tx.hash);
          if (receipt.status === 1) {
            dispatch(mineTransaction(receipt.transactionHash));
          } else {
            dispatch(revertTransaction(receipt.transactionHash));
          }
        });
      }
    } catch (e) {
      console.error(e);
      dispatch(declineTransaction(e.message));
    }
  }
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
      })
      .addCase(setWalletConnected, (state) => {
        state.status = "idle";
        state.orders = [];
      })
      .addCase(setWalletDisconnected, (state) => {
        state.status = "idle";
        state.orders = [];
      });
  },
});

export const { clear } = ordersSlice.actions;
export const selectOrder = (state: RootState) => state.orders.orders[0];
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export default ordersSlice.reducer;
