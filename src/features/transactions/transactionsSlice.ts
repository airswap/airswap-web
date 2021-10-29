import { LightOrder } from "@airswap/types";
import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import {
  declineTransaction,
  mineTransaction,
  revertTransaction,
  submitTransaction,
} from "./transactionActions";

export interface DepositOrWithdrawOrder {
  signerToken: string;
  signerAmount: string;
  senderToken: string;
  senderAmount: string;
}

export type TransactionType = "Approval" | "Order" | "Deposit" | "Withdraw";

export interface SubmittedTransaction {
  type: TransactionType;
  hash?: string; // LL orders doesn't have hash
  status: "processing" | "succeeded" | "reverted";
  nonce?: string;
  expiry?: string;
  timestamp: number;
  protocol?: "request-for-quote" | "last-look";
}

export interface SubmittedOrder extends SubmittedTransaction {
  order: LightOrder;
}

export interface SubmittedRFQOrder extends SubmittedOrder {}

export interface SubmittedLastLookOrder extends SubmittedOrder {}

export interface SubmittedApproval extends SubmittedTransaction {
  tokenAddress: string;
}

export interface SubmittedDepositOrder extends SubmittedTransaction {
  order: DepositOrWithdrawOrder;
}

export interface SubmittedWithdrawOrder extends SubmittedTransaction {
  order: DepositOrWithdrawOrder;
}

export interface TransactionsState {
  all: SubmittedTransaction[];
}

const initialState: TransactionsState = {
  all: [],
};

function updateTransaction(
  state: TransactionsState,
  nonce: string,
  hash: string,
  signerWallet: string,
  status: "processing" | "succeeded" | "reverted"
) {
  for (let i in state.all) {
    if (hash) {
      if (state.all[i].hash === hash) {
        state.all[i] = {
          ...state.all[i],
          status,
        };
        break;
      }
    } else {
      //@ts-ignore
      if (
        state.all[i].nonce === nonce &&
        state.all[i].order!.signerWallet === signerWallet
      ) {
        state.all[i] = {
          ...state.all[i],
          timestamp: Date.now(),
          status,
        };
        break;
      }
    }
  }
}

export const transactionsSlice = createSlice({
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
      state.all.unshift(action.payload);
    });
    builder.addCase(declineTransaction, (state, action) => {
      console.error(action.payload);
    });
    builder.addCase(revertTransaction, (state, action) => {
      updateTransaction(state, "", action.payload.hash, "", "reverted");
    });
    builder.addCase(mineTransaction, (state, action) => {
      updateTransaction(
        state,
        action.payload?.nonce,
        action.payload?.hash,
        action.payload?.signerWallet,
        "succeeded"
      );
    });
  },
});

export const { clear, setTransactions } = transactionsSlice.actions;
export const selectTransactions = (state: RootState) => state.transactions.all;
export const selectPendingApprovals = (state: RootState) =>
  state.transactions.all.filter(
    (tx) => tx.status === "processing" && tx.type === "Approval"
  ) as SubmittedApproval[];
export default transactionsSlice.reducer;
