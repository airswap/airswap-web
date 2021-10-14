import { Pricing, Levels, Formula } from "@airswap/types";
import { calculateCostFromLevels } from "@airswap/utils";
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";

import { RootState } from "../../app/store";
import { selectTradeTerms } from "../tradeTerms/tradeTermsSlice";

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
});

export const { updatePricing, clearPricing } = pricingSlice.actions;

export function pricingIsLevels(value: Levels | Formula): value is Levels {
  return typeof value !== "string";
}

const selectPricing = (state: RootState) => state.pricing;

export const selectBestPricing = createSelector(
  selectTradeTerms,
  selectPricing,
  (terms, pricing) => {
    let bestQuoteAmount = new BigNumber(0);
    let bestPricing: {
      pricing: Levels;
      locator: string;
      quoteAmount: string;
    } | null = null;

    const { quoteToken, baseToken, baseTokenAmount, side } = terms;

    Object.keys(pricing).forEach((locator) => {
      const locatorPricing = pricing[locator];
      const relevantIndex = locatorPricing.findIndex(
        (p) =>
          p.quoteToken === quoteToken.address &&
          p.baseToken === baseToken.address
      );

      if (relevantIndex === -1) return;
      const relevantPricing =
        locatorPricing[relevantIndex][side === "sell" ? "bid" : "ask"];

      if (!pricingIsLevels(relevantPricing)) {
        console.warn(
          `Unable to use pricing for locator ${locator}:` +
            `formulae not supported yet`
        );
        return;
      }

      const quoteAmount = new BigNumber(
        calculateCostFromLevels(baseTokenAmount, relevantPricing)
      );

      if (
        (side === "sell" && quoteAmount.gt(bestQuoteAmount)) ||
        (side === "buy" && quoteAmount.lt(bestQuoteAmount))
      ) {
        bestQuoteAmount = quoteAmount;
        bestPricing = {
          locator,
          pricing: relevantPricing,
          quoteAmount: quoteAmount.toString(),
        };
      }
    });

    return bestPricing;
  }
);

export default pricingSlice.reducer;
