import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export type TradeTerms = {
  /**
   * The token whose quantity is known
   */
  baseToken: { address: string; decimals: number };
  baseAmount: string;
  /**
   * The token whose quantity is unknown
   */
  quoteToken: { address: string; decimals: number };
  /**
   * The amount of quote token (once known).
   */
  quoteAmount: string | null;
  /**
   * Sell means sending a known amount of baseToken to receive an as yet unknown
   * amount of quoteToken. Buy means sending an as yet unknown amount of
   * quoteToken to receive a known amount of baseToken.
   */
  side: "sell" | "buy";
};

const initialState: TradeTerms = {
  baseToken: { address: "", decimals: 18 },
  quoteToken: { address: "", decimals: 18 },
  baseAmount: "",
  quoteAmount: null,
  side: "sell",
};

const tradeTermsSlice = createSlice({
  name: "tradeTerms",
  initialState,
  reducers: {
    clear: () => initialState,
    set: (_, action: PayloadAction<TradeTerms>) => action.payload,
    setQuoteAmount: (state, action: PayloadAction<string>) => {
      state.quoteAmount = action.payload;
    },
    clearQuoteAmount: (state) => {
      state.quoteAmount = null;
    },
  },
});

export const selectTradeTerms = (state: RootState) => state.tradeTerms;
export const selectQuoteTokenAddress = (state: RootState) =>
  state.tradeTerms.quoteToken.address;

export const {
  set: setTradeTerms,
  clear: clearTradeTerms,
  setQuoteAmount: setTradeTermsQuoteAmount,
  clearQuoteAmount: clearTradeTermsQuoteAmount,
} = tradeTermsSlice.actions;

export default tradeTermsSlice.reducer;
