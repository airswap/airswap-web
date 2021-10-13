import { Server } from "@airswap/libraries";
import { calculateCostFromLevels } from "@airswap/utils";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";

import { AppDispatch, RootState } from "../../app/store";
import { selectTradeTerms } from "../tradeTerms/tradeTermsSlice";

// TODO: have these types exported from @airswap/libraries.
export type Levels = [string, string][];
type Formula = string;
type Pair = {
  baseToken: string;
  quoteToken: string;
};

type PricingDetails =
  | {
      bid: Levels;
      ask: Levels;
    }
  | {
      bid: Formula;
      ask: Formula;
    };

type Pricing = Pair & PricingDetails;

export interface PricingState {
  [locator: string]: Pricing[];
}

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

export const subscribe = createAsyncThunk<
  () => Promise<void>, // Return type (returns a teardown.)
  {
    // TODO: can remove locator once it is public on Server.
    locator: string;
    server: Server;
    pair: {
      baseToken: string;
      quoteToken: string;
    };
  }, // Params
  {
    // thunkApi
    dispatch: AppDispatch;
    state: RootState;
  }
>("pricing/subscribe", async (params, thunkApi) => {
  const { locator, server, pair } = params;
  function onPricing(pricing: Pricing[]) {
    const relevantPricing = pricing.find(
      (p) => p.baseToken === pair.baseToken && p.quoteToken === pair.quoteToken
    );
    if (relevantPricing) {
      thunkApi.dispatch(updatePricing({ locator, pricing: relevantPricing }));
    }
  }
  server.on("pricing", onPricing);
  await server.subscribe([pair]);

  return async () => {
    try {
      server.off("pricing", onPricing);
      await server.unsubscribeAll();
    } catch (e) {
      console.error("Error tearing down last look subscription: ", e);
      // (Doesn't really matter)
    } finally {
      thunkApi.dispatch(clearPricing);
      server.disconnect();
    }
  };
});

function pricingIsLevels(value: Levels | Formula): value is Levels {
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
