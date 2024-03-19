import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../app/store";
import { ASSUMED_EXPIRY_NOTIFICATION_BUFFER_MS } from "../../constants/configParams";
import {
  ProtocolType,
  StatusType,
  SubmittedApproval,
  SubmittedCancellation,
  SubmittedDepositOrder,
  SubmittedLastLookOrder,
  SubmittedTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { ClearOrderType } from "../../types/clearOrderType";
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
  updateTransactions,
} from "./transactionActions";
import { filterTransactionByDate } from "./transactionUtils";

export interface TransactionsState {
  all: SubmittedTransaction[];
  filter: {
    [ClearOrderType.failed]?: number;
    [ClearOrderType.all]?: number;
  };
}

const initialState: TransactionsState = {
  all: [],
  filter: {},
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
    setFilter: (state, action: PayloadAction<ClearOrderType>) => {
      state.filter = {
        ...state.filter,
        [action.payload]: new Date().getTime(),
      };
    },
    setFilters: (state, action: PayloadAction<TransactionsState["filter"]>) => {
      state.filter = action.payload;
    },
    setTransactions: (state, action: PayloadAction<SubmittedTransaction[]>) => {
      state.all = action.payload;
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
    builder.addCase(updateTransactions, (state, action) => {
      return {
        ...state,
        transactions: action.payload,
      };
    });
    builder.addCase(setWalletConnected, () => initialState);
    builder.addCase(setWalletDisconnected, () => initialState);
  },
});

export const { clear, setFilter, setFilters, setTransactions } =
  transactionsSlice.actions;

export const selectTransactions = (state: RootState): SubmittedTransaction[] =>
  state.transactions.all;

export const selectFilteredTransactions = (state: RootState) => {
  const { all, filter } = state.transactions;
  const clearAllOrdersDate = filter[ClearOrderType.all];
  const clearFailedOrdersDate = filter[ClearOrderType.failed];

  return all
    .filter(
      (transaction) =>
        !clearAllOrdersDate ||
        filterTransactionByDate(transaction, clearAllOrdersDate)
    )
    .filter(
      (transaction) =>
        !clearFailedOrdersDate ||
        filterTransactionByDate(transaction, clearFailedOrdersDate, "declined")
    );
};

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

export const selectTransactionsFilter = (state: RootState) => {
  return state.transactions.filter;
};

export default transactionsSlice.reducer;
