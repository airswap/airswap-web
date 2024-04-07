import { OrderERC20, Levels } from "@airswap/utils";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";

import { RootState } from "../../app/store";
import { AppError } from "../../errors/appError";
import { gasUsedPerSwap } from "../gasCost/gasCostApi";
import { selectGasPriceInQuoteTokens } from "../gasCost/gasCostSlice";
import { selectBestPricing } from "../pricing/pricingSlice";
import { selectTradeTerms } from "../tradeTerms/tradeTermsSlice";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";
import { orderSortingFunction } from "./ordersHelpers";

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

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<OrderERC20[]>) => {
      state.orders = action.payload;
    },
    setStatus: (state, action: PayloadAction<OrdersState["status"]>) => {
      state.status = action.payload;
    },
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
    setReRequestTimerId: (state, action: PayloadAction<number | null>) => {
      if (state.reRequestTimerId) {
        clearTimeout(state.reRequestTimerId);
      }

      state.reRequestTimerId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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

export const {
  clear,
  setErrors,
  setOrders,
  setResetStatus,
  setReRequestTimerId,
  setStatus,
} = ordersSlice.actions;
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

    // TODO: Delete this
    // Temp disable bestRfqOrder
    // @ts-ignore
    bestRfqOrder = null;

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
