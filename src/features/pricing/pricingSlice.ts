import { Pricing } from "@airswap/types";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";

import { RootState } from "../../app/store";
import { selectProtocolFee } from "../metadata/metadataSlice";
import {
  clearTradeTerms,
  selectTradeTerms,
} from "../tradeTerms/tradeTermsSlice";
import { calculateQuoteAmount } from "./pricingApi";

export interface PricingState {
  [locator: string]: Pricing[];
}

type Pair = {
  baseToken: string;
  quoteToken: string;
};

// Initially empty
const initialState: PricingState = {};

export const pricingSlice = createSlice({
  name: "pricing",
  initialState,
  reducers: {
    updatePricing: (
      state,
      action: PayloadAction<{ locator: string; pricing: Pricing }>
    ) => {
      const { locator, pricing } = action.payload;
      if (!state[locator]) {
        state[locator] = [pricing];
      } else {
        const existingIndex = state[locator].findIndex(
          (existingPricing) =>
            existingPricing.baseToken === pricing.baseToken &&
            existingPricing.quoteToken === pricing.quoteToken
        );
        if (existingIndex !== -1) {
          state[locator][existingIndex] = pricing;
        } else {
          state[locator].push(pricing);
        }
      }
    },
    clearPricing: (
      state,
      action: PayloadAction<{ locator: string; pair: Pair }>
    ) => {
      const { locator, pair } = action.payload;
      if (!state[locator]) return;
      const i = state[locator].findIndex(
        (existingPricing) =>
          existingPricing.baseToken === pair.baseToken &&
          existingPricing.quoteToken === pair.quoteToken
      );
      if (i === -1) return;
      state[locator].splice(i, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearTradeTerms, () => initialState);
  },
});

export const { updatePricing, clearPricing } = pricingSlice.actions;

const selectPricing = (state: RootState) => state.pricing;

export const selectBestPricing = createSelector(
  selectTradeTerms,
  selectPricing,
  selectProtocolFee,
  (terms, pricing, protocolFee) => {
    let bestQuoteAmount = new BigNumber(0);
    let bestPricing: {
      locator: string;
      quoteAmount: string;
    } | null = null;

    const { quoteToken, baseToken, baseAmount: baseTokenAmount, side } = terms;

    Object.keys(pricing).forEach((locator) => {
      const locatorPricing = pricing[locator];
      const relevantIndex = locatorPricing.findIndex(
        (p) =>
          p.quoteToken.toLowerCase() === quoteToken.address.toLowerCase() &&
          p.baseToken.toLowerCase() === baseToken.address.toLowerCase()
      );

      if (relevantIndex === -1) return;
      const relevantPricing: Pricing = locatorPricing[relevantIndex];

      try {
        const quoteAmount = new BigNumber(
          calculateQuoteAmount({
            baseAmount: baseTokenAmount,
            pricing: relevantPricing,
            protocolFee: protocolFee,
            side,
          })
        );
        if (
          (side === "sell" && quoteAmount.gt(bestQuoteAmount)) ||
          (side === "buy" && quoteAmount.lt(bestQuoteAmount))
        ) {
          bestQuoteAmount = quoteAmount;
          bestPricing = {
            locator,
            quoteAmount: quoteAmount.toString(),
          };
        }
      } catch (e) {
        // calculateQuoteAmount will throw if the amount exceeds the maximum or
        // is less than the minimum - we can ignore these makers for the purpose
        // of this quote.
        return;
      }
    });

    return bestPricing;
  }
);

export default pricingSlice.reducer;
