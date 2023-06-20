import { OrderERC20 } from "@airswap/types";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../app/store";
import { ASSUMED_EXPIRY_NOTIFICATION_BUFFER_MS } from "../../constants/configParams";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import {
  declineTransaction,
  expireTransaction,
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

export type TransactionType =
  | "Approval"
  | "Order"
  | "Deposit"
  | "Withdraw"
  | "Cancel";

export type StatusType =
  | "processing"
  | "succeeded"
  | "reverted"
  | "declined"
  | "expired";

export type ProtocolType = "request-for-quote-erc20" | "last-look-erc20";

export interface SubmittedTransaction {
  type: TransactionType;
  hash?: string; // LL orders doesn't have hash
  status: StatusType;
  nonce?: string;
  expiry?: string;
  timestamp: number;
  protocol?: ProtocolType;
}

export interface SubmittedTransactionWithOrder extends SubmittedTransaction {
  order: OrderERC20;
}

export interface SubmittedRFQOrder extends SubmittedTransactionWithOrder {}

export interface SubmittedLastLookOrder extends SubmittedTransactionWithOrder {}

export interface LastLookTransaction
  extends SubmittedTransaction,
    SubmittedLastLookOrder {}
export interface RfqTransaction
  extends SubmittedTransaction,
    SubmittedRFQOrder {}

export interface SubmittedApproval extends SubmittedTransaction {
  tokenAddress: string;
}

export interface SubmittedCancellation extends SubmittedTransaction {}

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

function updateTransaction(params: {
  state: TransactionsState;
  nonce?: string;
  hash?: string;
  signerWallet?: string;
  status: StatusType;
  protocol?: ProtocolType;
}): void {
  const { state, nonce, hash, signerWallet, status } = params;
  if (!!signerWallet && !!nonce) {
    const swap = state.all.find(
      (s) =>
        s.nonce === nonce &&
        (s as SubmittedLastLookOrder).order.signerWallet.toLowerCase() ===
          signerWallet!.toLowerCase()
    );
    if (swap) {
      swap.timestamp = Date.now();
      swap.status = status;
      swap.hash = hash;
    }
  } else if (hash) {
    const swap = state.all.find((s) => s.hash === hash);
    if (swap) {
      swap.status = status;
    }
  } else {
    console.warn(
      "Can't update transaction without either signerWallet and nonce, ",
      "or transaction hash\n",
      "Supplied params: ",
      params
    );
  }
}

const expiryTimeouts: Record<string, number> = {};

const clearExpiry = (signerWallet?: string, nonce?: string) => {
  const uniqueKey = `${signerWallet}/${nonce}`;

  if (expiryTimeouts[uniqueKey]) {
    clearTimeout(expiryTimeouts[uniqueKey]);
    delete expiryTimeouts[uniqueKey];
  }
};

export const submitTransactionWithExpiry = createAsyncThunk<
  // Return type of the payload creator
  void,
  // Params
  {
    transaction: SubmittedTransaction;
    signerWallet: string;
    onExpired: () => void;
  },
  // Types for ThunkAPI
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  "orders/approve",
  async ({ transaction, signerWallet, onExpired }, { getState, dispatch }) => {
    dispatch(submitTransaction(transaction));
    if (!transaction.expiry) {
      console.warn(
        "submitTransactionWithExpiry called with transaction that has no expiry"
      );
      return;
    }

    const expiresAtMs = parseInt(transaction.expiry) * 1000;
    const timeToExpiryNotification =
      expiresAtMs - Date.now() + ASSUMED_EXPIRY_NOTIFICATION_BUFFER_MS;
    const uniqueTransactionKey = `${signerWallet}/${transaction.nonce}`;

    expiryTimeouts[uniqueTransactionKey] = window.setTimeout(() => {
      dispatch(
        expireTransaction({
          signerWallet,
          nonce: transaction.nonce!,
        })
      );
      onExpired();
    }, timeToExpiryNotification);
  }
);

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
      clearExpiry(action.payload.signerWallet, action.payload.nonce);
      updateTransaction({
        state,
        hash: action.payload.hash,
        nonce: action.payload.nonce,
        signerWallet: action.payload.signerWallet,
        status: "declined",
        protocol: action.payload.protocol,
      });
    });
    builder.addCase(revertTransaction, (state, action) => {
      clearExpiry(action.payload.signerWallet, action.payload.nonce);
      updateTransaction({
        state,
        signerWallet: action.payload.signerWallet,
        nonce: action.payload.nonce,
        hash: action.payload.hash,
        status: "reverted",
      });
    });
    builder.addCase(expireTransaction, (state, action) => {
      const { signerWallet, nonce } = action.payload;
      clearExpiry(signerWallet, nonce);
      updateTransaction({
        state,
        signerWallet,
        nonce,
        status: "expired",
      });
    });
    builder.addCase(mineTransaction, (state, action) => {
      clearExpiry(action.payload.signerWallet, action.payload.nonce);
      updateTransaction({
        state,
        hash: action.payload.hash,
        nonce: action.payload.nonce,
        signerWallet: action.payload.signerWallet,
        status: "succeeded",
        protocol: action.payload.protocol,
      });
    });
    builder.addCase(setWalletConnected, () => initialState);
    builder.addCase(setWalletDisconnected, () => initialState);
  },
});

export const { clear, setTransactions } = transactionsSlice.actions;
export const selectTransactions = (state: RootState) => state.transactions.all;

export const selectPendingTransactions = createSelector(
  selectTransactions,
  (transactions) => {
    return transactions.filter((tx) => tx.status === "processing");
  }
);

export const selectOrderTransactions = createSelector(
  selectTransactions,
  (transactions) => {
    return transactions.filter((tx) => tx.type === "Order");
  }
);

export const selectPendingDeposits = (
  state: RootState
): SubmittedDepositOrder[] =>
  state.transactions.all.filter(
    (tx) => tx.status === "processing" && tx.type === "Deposit"
  ) as SubmittedDepositOrder[];

export const selectPendingApprovals = (state: RootState) =>
  state.transactions.all.filter(
    (tx) => tx.status === "processing" && tx.type === "Approval"
  ) as SubmittedApproval[];

export const selectCancellations = (state: RootState) =>
  state.transactions.all.filter(
    (tx) => tx.status === "succeeded" && tx.type === "Cancel"
  ) as SubmittedCancellation[];

export const selectPendingCancellations = (state: RootState) =>
  state.transactions.all.filter(
    (tx) => tx.status === "processing" && tx.type === "Cancel"
  ) as SubmittedCancellation[];

export default transactionsSlice.reducer;
