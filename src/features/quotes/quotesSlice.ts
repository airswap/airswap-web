import { Pricing } from "@airswap/utils";
import { createSlice } from "@reduxjs/toolkit";

import { isExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricingHelpers";
import { PricingErrorType } from "../../errors/pricingError";
import { fetchQuotes } from "./quotesApi";

interface QuotesState {
  isFailed: boolean;
  isLoading: boolean;
  bestQuote?: Pricing;
  error?: PricingErrorType;
}

const initialState: QuotesState = {
  isFailed: false,
  isLoading: false,
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchQuotes.pending,
      (): QuotesState => ({
        isFailed: false,
        isLoading: true,
      })
    );

    builder.addCase(
      fetchQuotes.fulfilled,
      (state, action): QuotesState => ({
        ...state,
        isLoading: false,
        ...(isExtendedPricing(action.payload) && { bestQuote: action.payload }),
        ...(!isExtendedPricing(action.payload) && { error: action.payload }),
      })
    );

    builder.addCase(
      fetchQuotes.rejected,
      (state, action): QuotesState => ({
        ...state,
        isFailed: true,
        isLoading: false,
      })
    );
  },
});

export default quotesSlice.reducer;
