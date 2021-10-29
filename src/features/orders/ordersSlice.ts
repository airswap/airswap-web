import { wethAddresses } from "@airswap/constants";
import { Server } from "@airswap/libraries";
import * as LightContract from "@airswap/light/build/contracts/Light.sol/Light.json";
//@ts-ignore
import * as lightDeploys from "@airswap/light/deploys.js";
import { Levels, LightOrder } from "@airswap/types";
import { toAtomicString } from "@airswap/utils";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";
import { Contract, Transaction } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { notifyTransaction } from "../../components/Toasts/ToastController";
import { RFQ_EXPIRY_BUFFER_MS } from "../../constants/configParams";
import nativeETH from "../../constants/nativeETH";
import {
  allowancesLightActions,
  allowancesWrapperActions,
} from "../balances/balancesSlice";
import { selectBestPricing } from "../pricing/pricingSlice";
import { selectTradeTerms } from "../tradeTerms/tradeTermsSlice";
import {
  declineTransaction,
  mineTransaction,
  revertTransaction,
  submitTransaction,
} from "../transactions/transactionActions";
import {
  SubmittedApproval,
  SubmittedDepositOrder,
  SubmittedRFQOrder,
  SubmittedWithdrawOrder,
} from "../transactions/transactionsSlice";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import {
  approveToken,
  depositETH,
  orderSortingFunction,
  requestOrders,
  takeOrder,
  withdrawETH,
} from "./orderApi";

export interface OrdersState {
  orders: LightOrder[];
  status: "idle" | "requesting" | "approving" | "taking" | "failed";
  reRequestTimerId: number | null;
}

const initialState: OrdersState = {
  orders: [],
  status: "idle",
  reRequestTimerId: null,
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
            dispatch(
              mineTransaction({
                hash: receipt.transactionHash,
                nonce: "",
                signerWallet: "",
              })
            );
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
            dispatch(
              mineTransaction({
                hash: receipt.transactionHash,
                nonce: "",
                signerWallet: "",
              })
            );
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
  async (
    params: {
      servers: Server[];
      signerToken: string;
      senderToken: string;
      senderAmount: string;
      senderTokenDecimals: number;
      senderWallet: string;
    },
    { dispatch }
  ) => {
    const orders = await requestOrders(
      params.servers,
      params.signerToken,
      params.senderToken,
      params.senderAmount,
      params.senderTokenDecimals,
      params.senderWallet
    );
    if (orders.length) {
      const bestOrder = [...orders].sort(orderSortingFunction)[0];
      const expiry = parseInt(bestOrder.expiry) * 1000;
      const timeTilReRequest = expiry - Date.now() - RFQ_EXPIRY_BUFFER_MS;
      const reRequestTimerId = window.setTimeout(
        () => dispatch(request(params)),
        timeTilReRequest
      );
      dispatch(setReRequestTimerId(reRequestTimerId));
    }
    return orders;
  }
);

export const approve = createAsyncThunk<
  // Return type of the payload creator
  void,
  // Params
  {
    token: string;
    library: any;
    nonce?: string;
    contractType: "Wrapper" | "Light";
    chainId: number;
  },
  // Types for ThunkAPI
  {
    // thunkApi
    dispatch: AppDispatch;
    state: RootState;
  }
>("orders/approve", async (params, { getState, dispatch }) => {
  let tx: Transaction;
  try {
    tx = await approveToken(params.token, params.library, params.contractType);
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
        console.debug("Approval", tx);
        const receipt = await params.library.getTransactionReceipt(tx.hash);
        const state: RootState = getState() as RootState;
        const tokens = Object.values(state.metadata.tokens.all);
        if (receipt.status === 1) {
          dispatch(
            mineTransaction({
              nonce: receipt.nonce,
              hash: receipt.transactionHash,
              signerWallet: "",
            })
          );
          // Optimistically update allowance (this is not really optimistic,
          // but it preempts receiving the event)
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
});

export const swaplistenerUnsubscribe = createAsyncThunk(
  "orders/swaplistener:unsubscribe",
  async (params: { library: any; chainId: any }, { getState, dispatch }) => {
    const { chainId, library } = params;
    let lightContract = new Contract(
      lightDeploys[chainId],
      LightContract.abi,
      library
    );
    console.debug(Date.now() + ": unsubscribed to swaplistener");
    lightContract.removeAllListeners("Swap");
  }
);

export const swaplistenerSubscribe = createAsyncThunk(
  "orders/swaplistener:subscribe",
  async (params: { library: any; chainId: any }, { getState, dispatch }) => {
    const { chainId, library } = params;
    const lightContract = new Contract(
      lightDeploys[chainId],
      LightContract.abi,
      library
    );
    if (lightContract) {
      console.debug(Date.now() + ": subscribed to swaplistener");

      //      lightContract.filters.Swap(null, "0x63CF6013aaB710Ca21F1404f71d37111d7F928a8", async (nonce: BigNumber, timestamp: BigNumber, signerWallet: string) => {
      lightContract.on(
        "Swap",
        async (
          nonce: BigNumber,
          timestamp: BigNumber,
          signerWallet: string
        ) => {
          const swapResult = {
            nonce: nonce.toString(),
            timestamp: timestamp.toString(),
            signerWallet: signerWallet.toString(),
          };
          console.debug({ nonce: swapResult.nonce });
          const state: RootState = getState() as RootState;
          const transaction = state.transactions.all.filter(
            (tx: any) => tx.nonce === swapResult.nonce
          )[0];
          const tokens = Object.values(state.metadata.tokens.all);
          if (transaction?.nonce) {
            dispatch(
              mineTransaction({
                signerWallet: swapResult.signerWallet,
                nonce: transaction.nonce,
                hash: "",
              })
            );
            notifyTransaction(
              "Order",
              //@ts-ignore
              transaction,
              tokens,
              false,
              params.library._network.chainId
            );
          }
        }
      );
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
        const transaction: SubmittedRFQOrder = {
          type: "Order",
          order: newOrder,
          protocol: "request-for-quote",
          hash: tx.hash,
          status: "processing",
          timestamp: Date.now(),
          nonce: params.order.nonce,
          expiry: params.order.expiry,
        };
        dispatch(submitTransaction(transaction));
      }
    } catch (e: any) {
      console.error(e);
      // TODO don't throw the actual error message, just show a helpful message
      dispatch(declineTransaction({ reason: "", hash: "" }));
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
      if (state.reRequestTimerId) {
        clearTimeout(state.reRequestTimerId);
        state.reRequestTimerId = null;
      }
    },
    setReRequestTimerId: (state, action: PayloadAction<number>) => {
      state.reRequestTimerId = action.payload;
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

export const { clear, setReRequestTimerId } = ordersSlice.actions;
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

export const selectFirstOrder = (state: RootState) => state.orders.orders[0];

export const selectBestOption = createSelector(
  selectTradeTerms,
  selectBestOrder,
  selectBestPricing,
  (terms, bestRfqOrder, bestPricing) => {
    if (!terms) return null;

    if (terms.side === "buy") {
      console.error(`Buy orders not implemented yet`);
      return null;
    }

    let pricing = (bestPricing as unknown) as {
      pricing: Levels;
      locator: string;
      quoteAmount: string;
    } | null;

    if (!bestRfqOrder && !pricing) return null;

    let lastLookOrder;
    if (pricing) {
      lastLookOrder = {
        quoteAmount: pricing!.quoteAmount,
        protocol: "last-look",
        pricing: pricing!,
      };
      if (!bestRfqOrder) return lastLookOrder;
    }

    let rfqOrder;
    let bestRFQSignerUnits: BigNumber | undefined;
    if (bestRfqOrder) {
      bestRFQSignerUnits = new BigNumber(bestRfqOrder.signerAmount).div(
        new BigNumber(10).pow(terms.quoteToken.decimals)
      );
      rfqOrder = {
        quoteAmount: bestRFQSignerUnits.toString(),
        protocol: "request-for-quote",
        order: bestRfqOrder,
      };
      if (!lastLookOrder) return rfqOrder;
    }

    // TODO: this should factor in gas.
    if (
      pricing &&
      bestRFQSignerUnits!.lte(new BigNumber(pricing.quoteAmount))
    ) {
      return lastLookOrder;
    } else {
      return rfqOrder;
    }
  }
);

export const selectOrdersStatus = (state: RootState) => state.orders.status;
export default ordersSlice.reducer;
