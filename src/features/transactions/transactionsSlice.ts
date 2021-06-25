import { LightOrder } from "@airswap/types";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  submitTransaction,
  declineTransaction,
  revertTransaction,
  mineTransaction,
} from "./transactionActions";

export interface SubmittedTransaction {
  type: "Approval" | "Order";
  hash: string;
  status: "processing" | "succeeded" | "reverted";
}

export interface SubmittedOrder extends SubmittedTransaction {
  order: LightOrder;
}

export interface SubmittedApproval extends SubmittedTransaction {
  tokenAddress: string;
}

export interface TransactionsState {
  all: SubmittedTransaction[];
}

const initialState: TransactionsState = {
  all: [],
};

function updateTransaction(
  state: TransactionsState,
  hash: string,
  status: "processing" | "succeeded" | "reverted"
) {
  for (let i in state.all) {
    if (state.all[i].hash === hash) {
      state.all[i] = {
        ...state.all[i],
        status,
      };
      break;
    }
  }
}

export const ordersSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clear: (state) => {
      state.all = [];
    },
    setTransactions: (state, action) => {
      try {
        state.all = action.payload.all;
      } catch (err) {
        console.error(err);
        state.all = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitTransaction, (state, action) => {
      state.all.push(action.payload);
    });
    builder.addCase(declineTransaction, (state, action) => {
      console.error(action.payload);
    });
    builder.addCase(revertTransaction, (state, action) => {
      updateTransaction(state, action.payload.hash, "reverted");
    });
    builder.addCase(mineTransaction, (state, action) => {
      updateTransaction(state, action.payload, "succeeded");
    });
  },
});

export const { clear, setTransactions } = ordersSlice.actions;
export const selectTransactions = (state: RootState) => state.transactions.all;
export default ordersSlice.reducer;
