import { wethAddresses } from "@airswap/constants";
import { LightOrder } from "@airswap/types";
import { toAtomicString } from "@airswap/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Transaction } from "ethers";

import { RootState } from "../../app/store";
import { notifyTransaction } from "../../components/Toasts/ToastController";
import nativeETH from "../../constants/nativeETH";
import {
  allowancesLightActions,
  allowancesWrapperActions,
} from "../balances/balancesSlice";
import {
  submitTransaction,
  mineTransaction,
  revertTransaction,
  declineTransaction,
} from "../transactions/transactionActions";
import {
  SubmittedOrder,
  SubmittedApproval,
  SubmittedWithdrawOrder,
  SubmittedDepositOrder,
} from "../transactions/transactionsSlice";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import {
  requestOrder,
  takeOrder,
  approveToken,
  orderSortingFunction,
  depositETH,
  withdrawETH,
} from "./orderAPI";

export interface OrdersState {
  orders: LightOrder[];
  status: "idle" | "requesting" | "approving" | "taking" | "failed";
}

const initialState: OrdersState = {
  orders: [],
  status: "idle",
};

const APPROVE_AMOUNT = "90071992547409910000000000";

// replaces WETH to ETH on Wrapper orders
const refactorOrder = (order: LightOrder, chainId: number) => {
  let newOrder = { ...order };
  if (order.senderToken === wethAddresses[chainId]) {
    newOrder.senderToken = nativeETH[chainId].address;
  } else if (order.signerToken === wethAddresses[chainId]) {
    newOrder.signerToken = nativeETH[chainId].address;
  }
  return newOrder;
};

export const deposit = createAsyncThunk(
  "orders/deposit",
  async (
    params: {
      chainId: number;
      senderAmount: string;
      senderTokenDecimals: number;
      provider: any;
    },
    { getState, dispatch }
  ) => {
    let tx: Transaction;
    try {
      tx = await depositETH(
        params.chainId,
        params.senderAmount,
        params.senderTokenDecimals,
        params.provider
      );
      if (tx.hash) {
        const senderAmount = toAtomicString(
          params.senderAmount,
          params.senderTokenDecimals
        );
        // Since this is a Deposit, senderAmount === signerAmount
        const transaction: SubmittedDepositOrder = {
          type: "Deposit",
          order: {
            signerToken: wethAddresses[params.chainId],
            signerAmount: senderAmount,
            senderToken: nativeETH[params.chainId].address,
            senderAmount: senderAmount,
          },
          hash: tx.hash,
          status: "processing",
          timestamp: Date.now(),
        };
        dispatch(submitTransaction(transaction));
        params.provider.once(tx.hash, async () => {
          const receipt = await params.provider.getTransactionReceipt(tx.hash);
          const state: RootState = getState() as RootState;
          const tokens = Object.values(state.metadata.tokens.all);
          if (receipt.status === 1) {
            dispatch(mineTransaction(receipt.transactionHash));
            notifyTransaction(
              "Deposit",
              transaction,
              tokens,
              false,
              params.chainId
            );
          } else {
            dispatch(revertTransaction(receipt.transactionHash));
            notifyTransaction(
              "Deposit",
              transaction,
              tokens,
              true,
              params.chainId
            );
          }
        });
      }
    } catch (e: any) {
      console.error(e);
      dispatch(declineTransaction(e.message));
      throw e;
    }
  }
);

export const withdraw = createAsyncThunk(
  "orders/withdraw",
  async (
    params: {
      chainId: number;
      senderAmount: string;
      senderTokenDecimals: number;
      provider: any;
    },
    { getState, dispatch }
  ) => {
    let tx: Transaction;
    try {
      tx = await withdrawETH(
        params.chainId,
        params.senderAmount,
        params.senderTokenDecimals,
        params.provider
      );
      if (tx.hash) {
        const transaction: SubmittedWithdrawOrder = {
          type: "Withdraw",
          order: {
            signerToken: nativeETH[params.chainId].address,
            signerAmount: toAtomicString(
              params.senderAmount,
              params.senderTokenDecimals
            ),
            senderToken: wethAddresses[params.chainId],
            senderAmount: toAtomicString(
              params.senderAmount,
              params.senderTokenDecimals
            ),
          },
          hash: tx.hash,
          status: "processing",
          timestamp: Date.now(),
        };
        dispatch(submitTransaction(transaction));
        params.provider.once(tx.hash, async () => {
          const receipt = await params.provider.getTransactionReceipt(tx.hash);
          const state: RootState = getState() as RootState;
          const tokens = Object.values(state.metadata.tokens.all);
          if (receipt.status === 1) {
            dispatch(mineTransaction(receipt.transactionHash));
            notifyTransaction(
              "Withdraw",
              transaction,
              tokens,
              false,
              params.chainId
            );
          } else {
            dispatch(revertTransaction(receipt.transactionHash));
            notifyTransaction(
              "Withdraw",
              transaction,
              tokens,
              true,
              params.chainId
            );
          }
        });
      }
    } catch (e: any) {
      console.error(e);
      dispatch(declineTransaction(e.message));
      throw e;
    }
  }
);

export const request = createAsyncThunk(
  "orders/request",
  async (params: {
    chainId: number;
    signerToken: string;
    senderToken: string;
    senderAmount: string;
    senderTokenDecimals: number;
    senderWallet: string;
    provider: any;
  }) =>
    await requestOrder(
      params.chainId,
      params.signerToken,
      params.senderToken,
      params.senderAmount,
      params.senderTokenDecimals,
      params.senderWallet,
      params.provider
    )
);

export const approve = createAsyncThunk(
  "orders/approve",
  async (params: any, { getState, dispatch }) => {
    let tx: Transaction;
    try {
      tx = await approveToken(
        params.token,
        params.library,
        params.contractType
      );
      if (tx.hash) {
        const transaction: SubmittedApproval = {
          type: "Approval",
          hash: tx.hash,
          status: "processing",
          tokenAddress: params.token,
          timestamp: Date.now(),
        };
        dispatch(submitTransaction(transaction));
        params.library.once(tx.hash, async () => {
          const receipt = await params.library.getTransactionReceipt(tx.hash);
          const state: RootState = getState() as RootState;
          const tokens = Object.values(state.metadata.tokens.all);
          if (receipt.status === 1) {
            dispatch(mineTransaction(receipt.transactionHash));
            // Optimistically update allowance (this is not really optimisitc,
            // but it pre-empts receiving the event)
            if (params.contractType === "Light") {
              dispatch(
                allowancesLightActions.set({
                  tokenAddress: params.token,
                  amount: APPROVE_AMOUNT,
                })
              );
            } else if (params.contractType === "Wrapper") {
              dispatch(
                allowancesWrapperActions.set({
                  tokenAddress: params.token,
                  amount: APPROVE_AMOUNT,
                })
              );
            }

            notifyTransaction(
              "Approval",
              transaction,
              tokens,
              false,
              params.chainId
            );
          } else {
            dispatch(revertTransaction(receipt.transactionHash));
            notifyTransaction(
              "Approval",
              transaction,
              tokens,
              true,
              params.chainId
            );
          }
        });
      }
    } catch (e: any) {
      console.error(e);
      dispatch(declineTransaction(e.message));
      throw e;
    }
  }
);

export const take = createAsyncThunk(
  "orders/take",
  async (
    params: {
      order: LightOrder;
      library: any;
      contractType: "Light" | "Wrapper";
    },
    { getState, dispatch }
  ) => {
    let tx: Transaction;
    try {
      tx = await takeOrder(params.order, params.library, params.contractType);
      // When dealing with the Wrapper, since the "actual" swap is ETH <-> ERC20,
      // we should change the order tokens to WETH -> ETH
      let newOrder =
        params.contractType === "Light"
          ? params.order
          : refactorOrder(params.order, params.library._network.chainId);
      if (tx.hash) {
        const transaction: SubmittedOrder = {
          type: "Order",
          order: newOrder,
          hash: tx.hash,
          status: "processing",
          timestamp: Date.now(),
        };
        dispatch(submitTransaction(transaction));
        params.library.once(tx.hash, async () => {
          const receipt = await params.library.getTransactionReceipt(tx.hash);
          const state: RootState = getState() as RootState;
          const tokens = Object.values(state.metadata.tokens.all);
          if (receipt.status === 1) {
            dispatch(mineTransaction(receipt.transactionHash));
            notifyTransaction(
              "Order",
              transaction,
              tokens,
              false,
              params.library._network.chainId
            );
          } else {
            dispatch(revertTransaction(receipt.transactionHash));
            notifyTransaction(
              "Order",
              transaction,
              tokens,
              true,
              params.library._network.chainId
            );
          }
        });
      }
    } catch (e: any) {
      console.error(e);
      dispatch(declineTransaction(e.message));
      throw e;
    }
  }
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clear: (state) => {
      state.orders = [];
      state.status = "idle";
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
      .addCase(request.rejected, (state, action) => {
        state.status = "failed";
        state.orders = [];
      })
      .addCase(take.pending, (state) => {
        state.status = "taking";
      })
      .addCase(take.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(take.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(approve.pending, (state) => {
        state.status = "approving";
      })
      .addCase(approve.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(approve.rejected, (state) => {
        state.status = "failed";
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
/**
 * Sorts orders and returns the best order based on tokens received or sent
 * then falling back to expiry.
 */
export const selectBestOrder = (state: RootState) =>
  // Note that `.sort` mutates the array, so we need to clone it first to
  // prevent mutating state.
  [...state.orders.orders].sort(orderSortingFunction)[0];

export const selectSortedOrders = (state: RootState) =>
  [...state.orders.orders].sort(orderSortingFunction);
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export default ordersSlice.reducer;
