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
import { Transaction } from "ethers";

export interface OrdersState {
  orders: LightOrder[];
  status: "idle" | "requesting" | "taking" | "failed";
}

const initialState: OrdersState = {
  orders: [],
  status: "idle",
};

export interface TokenApprovalState {
  status: "incomplete" | "pending" | "complete";
}

const initialTokenApprovalState: TokenApprovalState = {
  status: "incomplete",
}


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
      });
  },
});

export const tokenApprovalSlice = createSlice({
  name: "tokenApproval",
  initialState: initialTokenApprovalState,
  reducers: {
    clearApproval: (state) => {
      state.status = "incomplete";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(approve.pending, (state) => {
        state.status = "pending";
      })
      .addCase(approve.fulfilled, (state) => {
        state.status = "complete";
      })
      .addCase(approve.rejected, (state) => {
        state.status = "incomplete"
      })
  }
})

export const { clear } = ordersSlice.actions;
export const selectOrder = (state: RootState) => state.orders.orders[0];
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectTokenApprovalStatus = (state: RootState) => state.tokenApproval.status;
export const tokenApprovalReducer = tokenApprovalSlice.reducer;
export default ordersSlice.reducer;
