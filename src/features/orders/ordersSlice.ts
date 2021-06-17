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
  allTokenApprovalStatus: {[tokenAddress: string]: string},
}

const initialTokenApprovalState: TokenApprovalState = {
  allTokenApprovalStatus: {"": "incomplete"}, // dictionary key value pair of token and approval status
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
  async (params: any) => {
    let tx: Transaction;
    try {
      tx = await approveToken(params.token, params.library);
      if (tx.hash) {
        console.log('tx:', tx);
      }
    } catch (e) {
      console.error(e);
    }
  }
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
    clearTokenApproval: (state) => {
      localStorage.setItem("tokenApprovalStatus", JSON.stringify({"": "incomplete"}));
      state.allTokenApprovalStatus = {"": "incomplete"};
    },
    initialize: (state) => {
      const tokenApprovalStateLocalStorage = localStorage.getItem("tokenApprovalStatus");
      if (typeof(tokenApprovalStateLocalStorage) === "string") {
        state.allTokenApprovalStatus = JSON.parse(tokenApprovalStateLocalStorage);
      } else {
        state = initialTokenApprovalState;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // TODO: Error handling (try/catch)
      .addCase(approve.pending, (state, action) => {
        const currentTokenAddress: string = action.meta.arg.token;
        state.allTokenApprovalStatus[currentTokenAddress] = "pending";
        localStorage.setItem("tokenApprovalStatus", JSON.stringify(state.allTokenApprovalStatus));
      })
      .addCase(approve.fulfilled, (state, action) => {
        const currentTokenAddress: string = action.meta.arg.token;
        state.allTokenApprovalStatus[currentTokenAddress] = "complete";
        localStorage.setItem("tokenApprovalStatus", JSON.stringify(state.allTokenApprovalStatus));
      })
      .addCase(approve.rejected, (state, action) => {
        const currentTokenAddress: string = action.meta.arg.token;
        state.allTokenApprovalStatus[currentTokenAddress] = "incomplete";
        localStorage.setItem("tokenApprovalStatus", JSON.stringify(state.allTokenApprovalStatus));
      });
  }
})

export const { clear } = ordersSlice.actions;
export const { initialize } = tokenApprovalSlice.actions;
export const selectOrder = (state: RootState) => state.orders.orders[0];
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectTokenApprovalStatus = (state: RootState) => state.tokenApproval.allTokenApprovalStatus;
export const tokenApprovalReducer = tokenApprovalSlice.reducer;
export default ordersSlice.reducer;
