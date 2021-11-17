import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { BigNumber } from "bignumber.js";

import { RootState } from "../../app/store";
import { selectQuoteTokenAddress } from "../tradeTerms/tradeTermsSlice";
import {
  setWalletConnected,
  setWalletDisconnected,
} from "../wallet/walletSlice";

export interface GasCostState {
  /**
   * "Fast" gas price **in WETH**
   */
  fastGasPrice: string | null;
  /**
   * Reference token prices by address, **in WETH**
   */
  tokenPrices: Record<string, string>;
}

const initialState: GasCostState = {
  fastGasPrice: null,
  tokenPrices: {},
};

const gasCostSlice = createSlice({
  name: "gasCost",
  initialState,
  reducers: {
    setFastGasPrice: (state, action: PayloadAction<string>) => {
      state.fastGasPrice = action.payload;
    },
    setTokenPrice: (
      state,
      action: PayloadAction<{
        tokenAddress: string;
        tokenPriceInWeth: string;
      }>
    ) => {
      state.tokenPrices[action.payload.tokenAddress.toLowerCase()] =
        action.payload.tokenPriceInWeth;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setWalletDisconnected, () => initialState)
      .addCase(setWalletConnected, () => initialState);
  },
});

export const selectGasPrice = (state: RootState) => state.gasCost.fastGasPrice;

export const selectQuoteTokenPrice = createSelector(
  (state: RootState) => state.gasCost.tokenPrices,
  selectQuoteTokenAddress,
  (tokenPrices, quoteTokenAddress) => tokenPrices[quoteTokenAddress]
);

export const selectGasPriceInQuoteTokens = createSelector(
  selectGasPrice,
  selectQuoteTokenPrice,
  (_gasPrice, _quoteTokenPrice) => {
    if (!_gasPrice || !_quoteTokenPrice) return null;
    const gasPrice = new BigNumber(_gasPrice);
    const quoteTokenPrice = new BigNumber(_quoteTokenPrice);
    return gasPrice.dividedBy(quoteTokenPrice);
  }
);

export const { setFastGasPrice, setTokenPrice } = gasCostSlice.actions;

export default gasCostSlice.reducer;
