import { OrderERC20, ProtocolIds, UnsignedOrderERC20 } from "@airswap/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricing";
import { isExtendedPricing } from "../../entities/ExtendedPricing/ExtendedPricingHelpers";
import { isOrderERC20 } from "../../entities/OrderERC20/OrderERC20Helpers";
import { PricingErrorType } from "../../errors/pricingError";
import { fetchBestPricing, fetchBestRfqOrder } from "./quotesApi";

interface QuotesState {
  isLastLookLoading: boolean;
  isRfqLoading: boolean;
  bestPricing?: ExtendedPricing;
  bestRfqOrder?: OrderERC20;
  bestLastLookOrder?: UnsignedOrderERC20;
  bestOrder?: OrderERC20 | UnsignedOrderERC20;
  bestOrderType?: ProtocolIds.RequestForQuoteERC20 | ProtocolIds.LastLookERC20;
  lastLookError?: PricingErrorType;
  rfqError?: PricingErrorType;
}

const initialState: QuotesState = {
  isLastLookLoading: false,
  isRfqLoading: false,
};

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setBestLastLookOrder: (
      state,
      action: PayloadAction<UnsignedOrderERC20>
    ): QuotesState => ({
      ...state,
      bestLastLookOrder: action.payload,
    }),

    setBestOrder: (
      state,
      action: PayloadAction<{
        order: OrderERC20 | UnsignedOrderERC20;
        type: ProtocolIds.RequestForQuoteERC20 | ProtocolIds.LastLookERC20;
      }>
    ): QuotesState => ({
      ...state,
      bestOrder: action.payload.order,
      bestOrderType: action.payload.type,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchBestPricing.pending,
      (state): QuotesState => ({
        ...state,
        isLastLookLoading: true,
        lastLookError: undefined,
      })
    );

    builder.addCase(
      fetchBestPricing.fulfilled,
      (state, action): QuotesState => {
        if (!isExtendedPricing(action.payload)) {
          return {
            ...state,
            isLastLookLoading: false,
            lastLookError: action.payload,
          };
        }

        return {
          ...state,
          isLastLookLoading: false,
          bestPricing: action.payload,
        };
      }
    );

    builder.addCase(
      fetchBestPricing.rejected,
      (state, action): QuotesState => ({
        ...state,
        isLastLookLoading: false,
        lastLookError: PricingErrorType.unknown,
      })
    );

    builder.addCase(
      fetchBestRfqOrder.pending,
      (state): QuotesState => ({
        ...state,
        isRfqLoading: true,
        rfqError: undefined,
      })
    );

    builder.addCase(
      fetchBestRfqOrder.fulfilled,
      (state, action): QuotesState => ({
        ...state,
        isRfqLoading: false,
        ...(isOrderERC20(action.payload) && { bestRfqOrder: action.payload }),
        ...(!isOrderERC20(action.payload) && { error: action.payload }),
      })
    );

    builder.addCase(
      fetchBestRfqOrder.rejected,
      (state): QuotesState => ({
        ...state,
        isRfqLoading: false,
        rfqError: PricingErrorType.unknown,
      })
    );
  },
});

export const { setBestLastLookOrder, setBestOrder } = quotesSlice.actions;

export default quotesSlice.reducer;
