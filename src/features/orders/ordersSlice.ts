import { Server, WETH } from "@airswap/libraries";
import { FullOrderERC20, OrderERC20, Levels, TokenInfo } from "@airswap/types";
import { toAtomicString } from "@airswap/utils";
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  Dispatch,
  PayloadAction,
} from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";
import { Transaction, providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import {
  notifyRejectedByUserError,
  notifyTransaction,
} from "../../components/Toasts/ToastController";
import {
  RFQ_EXPIRY_BUFFER_MS,
  RFQ_MINIMUM_REREQUEST_DELAY_MS,
} from "../../constants/configParams";
import nativeCurrency from "../../constants/nativeCurrency";
import { AppError, AppErrorType, isAppError } from "../../errors/appError";
import transformUnknownErrorToAppError from "../../errors/transformUnknownErrorToAppError";
import getWethAddress from "../../helpers/getWethAddress";
import toRoundedAtomicString from "../../helpers/toRoundedAtomicString";
import {
  allowancesSwapActions,
  allowancesWrapperActions,
} from "../balances/balancesSlice";
import { gasUsedPerSwap } from "../gasCost/gasCostApi";
import { selectGasPriceInQuoteTokens } from "../gasCost/gasCostSlice";
import { selectBestPricing } from "../pricing/pricingSlice";
import {
  clearTradeTerms,
  selectTradeTerms,
} from "../tradeTerms/tradeTermsSlice";
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
  submitTransactionWithExpiry,
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
  orders: OrderERC20[];
  status: "idle" | "requesting" | "signing" | "failed" | "reset";
  reRequestTimerId: number | null;
  errors: AppError[];
}

const initialState: OrdersState = {
  orders: [],
  status: "idle",
  reRequestTimerId: null,
  errors: [],
};

// replaces WETH to ETH on Wrapper orders
const refactorOrder = (order: OrderERC20, chainId: number) => {
  let newOrder = { ...order };
  if (order.senderToken === getWethAddress(chainId)) {
    newOrder.senderToken = nativeCurrency[chainId].address;
  } else if (order.signerToken === getWethAddress(chainId)) {
    newOrder.signerToken = nativeCurrency[chainId].address;
  }
  return newOrder;
};

export const handleOrderError = (dispatch: Dispatch, error: any) => {
  const appError = transformUnknownErrorToAppError(error);

  if (appError.error && "message" in appError.error) {
    dispatch(declineTransaction(appError.error.message));
  }

  if (appError.type === AppErrorType.rejectedByUser) {
    notifyRejectedByUserError();
  } else {
    dispatch(setErrors([appError]));
  }
};

export const deposit = createAsyncThunk(
  "orders/deposit",
  async (
    params: {
      chainId: number;
      senderAmount: string;
      senderTokenDecimals: number;
      provider: providers.Web3Provider;
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
            signerToken: getWethAddress(params.chainId),
            signerAmount: senderAmount,
            senderToken: nativeCurrency[params.chainId].address,
            senderAmount: senderAmount,
          },
          hash: tx.hash,
          status: "processing",
          timestamp: Date.now(),
        };
        dispatch(submitTransaction(transaction));
        params.provider.once(tx.hash, async () => {
          const receipt = await params.provider.getTransactionReceipt(tx.hash!);
          const state: RootState = getState() as RootState;
          const tokens = Object.values(state.metadata.tokens.all);
          if (receipt.status === 1) {
            dispatch(
              mineTransaction({
                hash: receipt.transactionHash,
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
            dispatch(
              revertTransaction({
                hash: receipt.transactionHash,
                reason: "Transaction reverted",
              })
            );
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
      handleOrderError(dispatch, e);
      throw e;
    }
  }
);

export const resetOrders = createAsyncThunk(
  "orders/reset",
  async (params: undefined, { getState, dispatch }) => {
    await dispatch(setResetStatus());
    dispatch(clear());
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
            signerToken: nativeCurrency[params.chainId].address,
            signerAmount: toAtomicString(
              params.senderAmount,
              params.senderTokenDecimals
            ),
            senderToken: getWethAddress(params.chainId),
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
      handleOrderError(dispatch, e);
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
      proxyingFor?: string;
    },
    { dispatch }
  ) => {
    const orders = await requestOrders(
      params.servers,
      params.signerToken,
      params.senderToken,
      params.senderAmount,
      params.senderTokenDecimals,
      params.senderWallet,
      params.proxyingFor
    );
    if (orders.length) {
      const bestOrder = [...orders].sort(orderSortingFunction)[0];
      const now = Date.now();
      const expiry = parseInt(bestOrder.expiry) * 1000;
      // Due to the sorting in orderSorting function, these orders will be at
      // the bottom of the list, so if the best one has a very short expiry
      // so do all the others. Return an empty order array as none are viable.
      if (expiry - now < RFQ_EXPIRY_BUFFER_MS) return [];

      const timeTilReRequest = Math.max(
        expiry - now - RFQ_EXPIRY_BUFFER_MS,
        RFQ_MINIMUM_REREQUEST_DELAY_MS
      );
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
    token: TokenInfo;
    library: any;
    contractType: "Wrapper" | "Swap";
    chainId: number;
    amount: string;
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
    const { token, contractType, amount } = params;
    const approveAmount = toRoundedAtomicString(amount, token.decimals);

    tx = await approveToken(
      token.address,
      params.library,
      contractType,
      approveAmount
    );
    if (tx.hash) {
      const transaction: SubmittedApproval = {
        type: "Approval",
        hash: tx.hash,
        status: "processing",
        tokenAddress: token.address,
        timestamp: Date.now(),
      };
      dispatch(submitTransaction(transaction));
      params.library.once(tx.hash, async () => {
        const receipt = await params.library.getTransactionReceipt(tx.hash);
        const state: RootState = getState() as RootState;
        const tokens = Object.values(state.metadata.tokens.all);
        if (receipt.status === 1) {
          dispatch(
            mineTransaction({
              hash: receipt.transactionHash,
            })
          );
          // Optimistically update allowance (this is not really optimistic,
          // but it preempts receiving the event)
          if (params.contractType === "Swap") {
            dispatch(
              allowancesSwapActions.set({
                tokenAddress: token.address,
                amount: approveAmount,
              })
            );
          } else if (params.contractType === "Wrapper") {
            dispatch(
              allowancesWrapperActions.set({
                tokenAddress: token.address,
                amount: approveAmount,
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
    handleOrderError(dispatch, e);
    throw e;
  }
});

export const take = createAsyncThunk<
  // Return type of the payload creator
  void,
  // Params
  {
    order: OrderERC20 | FullOrderERC20;
    library: any;
    contractType: "Swap" | "Wrapper";
    onExpired: () => void;
  },
  // Types for ThunkAPI
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("orders/take", async (params, { getState, dispatch }) => {
  const tx = await takeOrder(params.order, params.library, params.contractType);

  if (isAppError(tx)) {
    const appError = tx;
    if (appError.type === AppErrorType.rejectedByUser) {
      notifyRejectedByUserError();
      dispatch(
        revertTransaction({
          signerWallet: params.order.signerWallet,
          nonce: params.order.nonce,
          reason: appError.type,
        })
      );
    } else {
      dispatch(setErrors([appError]));
    }

    if (appError.error && "message" in appError.error) {
      dispatch(declineTransaction(appError.error.message));
    }

    throw appError;
  }

  // When dealing with the Wrapper, since the "actual" swap is ETH <-> ERC20,
  // we should change the order tokens to WETH -> ETH
  let newOrder =
    params.contractType === "Swap"
      ? params.order
      : refactorOrder(params.order, params.library._network.chainId);
  if (tx.hash) {
    const transaction: SubmittedRFQOrder = {
      type: "Order",
      order: newOrder,
      protocol: "request-for-quote-erc20",
      hash: tx.hash,
      status: "processing",
      timestamp: Date.now(),
      nonce: params.order.nonce,
      expiry: params.order.expiry,
    };
    dispatch(
      submitTransactionWithExpiry({
        transaction,
        signerWallet: params.order.signerWallet,
        onExpired: params.onExpired,
      })
    );
  }
});

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setResetStatus: (state) => {
      state.status = "reset";
    },
    setErrors: (state, action: PayloadAction<AppError[]>) => {
      state.errors = action.payload;
    },
    clear: (state) => {
      state.orders = [];
      state.status = "idle";
      state.errors = [];
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
        // Only update the orders if we were requesting them. This prevents a
        // very slow request influencing the state if we have since moved away
        // from it.
        if (state.status === "requesting") {
          state.status = "idle";
          state.orders = action.payload!;
        }
      })
      .addCase(request.rejected, (state, action) => {
        state.status = "failed";
        state.orders = [];
      })
      .addCase(take.pending, (state) => {
        state.status = "signing";
      })
      .addCase(take.fulfilled, (state, action) => {
        state.status = "idle";
        if (state.reRequestTimerId) {
          clearTimeout(state.reRequestTimerId);
          state.reRequestTimerId = null;
        }
      })
      .addCase(take.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(approve.pending, (state) => {
        state.status = "signing";
      })
      .addCase(approve.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(approve.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(deposit.pending, (state) => {
        state.status = "signing";
      })
      .addCase(deposit.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(deposit.rejected, (state) => {
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

export const { clear, setErrors, setResetStatus, setReRequestTimerId } =
  ordersSlice.actions;
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
  selectGasPriceInQuoteTokens,
  (terms, bestRfqOrder, bestPricing, gasPriceInQuoteTokens) => {
    if (!terms) return null;

    if (terms.side === "buy") {
      console.error(`Buy orders not implemented yet`);
      return null;
    }

    let pricing = bestPricing as unknown as {
      pricing: Levels;
      locator: string;
      quoteAmount: string;
    } | null;

    if (!bestRfqOrder && !pricing) return null;

    let lastLookOrder;
    if (pricing) {
      lastLookOrder = {
        quoteAmount: pricing!.quoteAmount,
        protocol: "last-look-erc20",
        pricing: pricing!,
      };
      if (!bestRfqOrder) return lastLookOrder;
    }

    let rfqOrder;
    let bestRFQQuoteTokens: BigNumber | undefined;
    if (bestRfqOrder) {
      bestRFQQuoteTokens = new BigNumber(bestRfqOrder.signerAmount).div(
        new BigNumber(10).pow(terms.quoteToken.decimals)
      );
      rfqOrder = {
        quoteAmount: bestRFQQuoteTokens.toString(),
        protocol: "request-for-quote-erc20",
        order: bestRfqOrder,
      };
      if (!lastLookOrder) return rfqOrder;
    }

    if (
      pricing &&
      bestRFQQuoteTokens &&
      bestRFQQuoteTokens
        .minus(gasPriceInQuoteTokens?.multipliedBy(gasUsedPerSwap) || 0)
        .lte(new BigNumber(pricing.quoteAmount))
    ) {
      return lastLookOrder;
    } else {
      return rfqOrder;
    }
  }
);

export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectOrdersErrors = (state: RootState) => state.orders.errors;

export default ordersSlice.reducer;
