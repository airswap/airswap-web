import { Server } from "@airswap/libraries";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../app/store";

// TODO: have these types exported from @airswap/libraries.
type Levels = [string, string][];
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

export default pricingSlice.reducer;
