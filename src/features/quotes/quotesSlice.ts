import { OrderERC20, UnsignedOrderERC20 } from "@airswap/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import { isExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricingHelpers";
import { PricingErrorType } from "../../errors/pricingError";
import { fetchBestPricing } from "./quotesApi";

interface QuotesState {
  isFailed: boolean;
  isLoading: boolean;
  bestPricing?: ExtendedPricing;
  bestOrder?: OrderERC20 | UnsignedOrderERC20;
  error?: PricingErrorType;
}

const initialState: QuotesState = {
  isFailed: false,
  isLoading: false,
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setBestOrder: (
      state,
      action: PayloadAction<OrderERC20 | UnsignedOrderERC20>
    ): QuotesState => ({
      ...state,
      bestOrder: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchBestPricing.pending,
      (): QuotesState => ({
        isFailed: false,
        isLoading: true,
      })
    );

    builder.addCase(
      fetchBestPricing.fulfilled,
      (state, action): QuotesState => ({
        ...state,
        isLoading: false,
        ...(isExtendedPricing(action.payload) && {
          bestPricing: action.payload,
        }),
        ...(!isExtendedPricing(action.payload) && { error: action.payload }),
      })
    );

    builder.addCase(
      fetchBestPricing.rejected,
      (state, action): QuotesState => ({
        ...state,
        isFailed: true,
        isLoading: false,
      })
    );
  },
});

export const { setBestOrder } = quotesSlice.actions;

export default quotesSlice.reducer;
