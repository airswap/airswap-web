import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../app/store";
import { ASSUMED_EXPIRY_NOTIFICATION_BUFFER_MS } from "../../constants/configParams";
import {
  SubmittedApprovalTransaction,
  SubmittedCancellation,
  SubmittedDepositTransaction,
  SubmittedLastLookOrder,
  SubmittedTransaction,
  SubmittedOrder,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { ClearOrderType } from "../../types/clearOrderType";
import {
  TransactionStatusType,
  TransactionTypes,
} from "../../types/transactionTypes";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import {
  declineTransaction,
  expireTransaction,
  revertTransaction,
  submitTransaction,
  updateTransactions,
} from "./transactionsActions";
import { filterTransactionByDate } from "./transactionsUtils";

export interface TransactionsState {
  transactions: SubmittedTransaction[];
  filter: {
    [ClearOrderType.failed]?: number;
    [ClearOrderType.all]?: number;
  };
}

const initialState: TransactionsState = {
  transactions: [],
  filter: {},
};

function updateTransaction(params: {
  state: TransactionsState;
  nonce?: string;
  hash?: string;
  signerWallet?: string;
  status: TransactionStatusType;
}): void {
  const { state, nonce, hash, signerWallet, status } = params;
  if (!!signerWallet && !!nonce) {
    const swap = state.transactions.find(
      (s) =>
        s.nonce === nonce &&
        (s as SubmittedOrder).order.signerWallet.toLowerCase() ===
          signerWallet!.toLowerCase()
    );
    if (swap) {
      swap.timestamp = Date.now();
      swap.status = status;
      swap.hash = hash;
    }
  } else if (hash) {
    const swap = state.transactions.find((s) => s.hash === hash);
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
    onExpired?: () => void;
  },
  // Types for ThunkAPI
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  "orders/submitTransactionWithExpiry",
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
      onExpired && onExpired();
    }, timeToExpiryNotification);
  }
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clear: (state) => {
      state.transactions = [];
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
      state.transactions = action.payload.slice(0, 20);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitTransaction, (state, action) => {
      state.transactions.unshift(action.payload);
    });
    builder.addCase(declineTransaction, (state, action) => {
      clearExpiry(action.payload.signerWallet, action.payload.nonce);
      updateTransaction({
        state,
        hash: action.payload.hash,
        nonce: action.payload.nonce,
        signerWallet: action.payload.signerWallet,
        status: TransactionStatusType.declined,
      });
    });
    builder.addCase(revertTransaction, (state, action) => {
      clearExpiry(action.payload.signerWallet, action.payload.nonce);
      updateTransaction({
        state,
        signerWallet: action.payload.signerWallet,
        nonce: action.payload.nonce,
        hash: action.payload.hash,
        status: TransactionStatusType.reverted,
      });
    });
    builder.addCase(expireTransaction, (state, action) => {
      const { signerWallet, nonce } = action.payload;
      clearExpiry(signerWallet, nonce);
      updateTransaction({
        state,
        signerWallet,
        nonce,
        status: TransactionStatusType.expired,
      });
    });
    builder.addCase(updateTransactions, (state, action): TransactionsState => {
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
  state.transactions.transactions;

export const selectFilteredTransactions = (state: RootState) => {
  const { transactions, filter } = state.transactions;
  const clearAllOrdersDate = filter[ClearOrderType.all];
  const clearFailedOrdersDate = filter[ClearOrderType.failed];

  return transactions
    .filter(
      (transaction) =>
        !clearAllOrdersDate ||
        filterTransactionByDate(transaction, clearAllOrdersDate)
    )
    .filter(
      (transaction) =>
        !clearFailedOrdersDate ||
        filterTransactionByDate(
          transaction,
          clearFailedOrdersDate,
          TransactionStatusType.declined
        )
    );
};

export const selectOrderTransactions = createSelector(
  selectTransactions,
  (transactions) => {
    return transactions.filter((tx) => tx.type === TransactionTypes.order);
  }
);

export const selectPendingTransactions = (
  state: RootState
): SubmittedTransaction[] =>
  state.transactions.transactions.filter(
    (tx) => tx.status === TransactionStatusType.processing
  ) as SubmittedTransaction[];

export const selectSuccessfulTransactions = (
  state: RootState
): SubmittedTransaction[] =>
  state.transactions.transactions.filter(
    (tx) => tx.status === TransactionStatusType.succeeded
  ) as SubmittedTransaction[];

export const selectPendingDeposits = (
  state: RootState
): SubmittedDepositTransaction[] =>
  state.transactions.transactions.filter(
    (tx) =>
      tx.status === TransactionStatusType.processing &&
      tx.type === TransactionTypes.deposit
  ) as SubmittedDepositTransaction[];

export const selectPendingWithdrawals = (
  state: RootState
): SubmittedDepositTransaction[] =>
  state.transactions.transactions.filter(
    (tx) =>
      tx.status === TransactionStatusType.processing &&
      tx.type === TransactionTypes.withdraw
  ) as SubmittedDepositTransaction[];

export const selectPendingApprovals = (state: RootState) =>
  state.transactions.transactions.filter(
    (tx) =>
      tx.status === TransactionStatusType.processing &&
      tx.type === TransactionTypes.approval
  ) as SubmittedApprovalTransaction[];

export const selectCancellations = (state: RootState) =>
  state.transactions.transactions.filter(
    (tx) => tx.type === TransactionTypes.cancel
  ) as SubmittedCancellation[];

export const selectPendingCancellations = (state: RootState) =>
  state.transactions.transactions.filter(
    (tx) =>
      tx.status === TransactionStatusType.processing &&
      tx.type === TransactionTypes.cancel
  ) as SubmittedCancellation[];

export const selectTransactionsFilter = (state: RootState) => {
  return state.transactions.filter;
};

export default transactionsSlice.reducer;
