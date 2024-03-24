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
import { approve, deposit, request, take } from "./ordersActions";
import { orderSortingFunction } from "./ordersApi";

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

    // TODO: Delete this
    // Temp disable bestRfqOrder
    // @ts-ignore
    // bestRfqOrder = null;

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
