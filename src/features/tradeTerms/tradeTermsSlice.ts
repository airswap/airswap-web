import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export type TradeTerms = {
  /**
   * The token whose quantity is known
   */
  baseToken: { address: string; decimals: number };
  /**
   * The token whose quantity is unknown
   */
  quoteToken: { address: string; decimals: number };
  baseTokenAmount: string;
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
  baseTokenAmount: "",
  side: "sell",
};

const tradeTermsSlice = createSlice({
  name: "tradeTerms",
  initialState,
  reducers: {
    clear: () => initialState,
    set: (_, action: PayloadAction<TradeTerms>) => action.payload,
  },
});

export const selectTradeTerms = (state: RootState) => state.tradeTerms;

export const { set: setTradeTerms, clear: clearTradeTerms } =
  tradeTermsSlice.actions;

export default tradeTermsSlice.reducer;
