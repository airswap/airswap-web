import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { walletDisconnected } from "../web3/web3Actions";
import { getGasPrice } from "./gasCostApi";

export interface GasCostState {
  isFailed: boolean;
  isLoading: boolean;
  isSuccessful: boolean;
  /**
   * "Fast" gas price **in WETH**
   */
  gasPrice?: string;
  /**
   * The estimated transaction of the swap contract **in WETH**
   */
  swapTransactionCost?: string;
  /**
   * Reference token prices by address, **in WETH**
   */
  tokenPrices: Record<string, string>;
}

const initialState: GasCostState = {
  isFailed: false,
  isLoading: false,
  isSuccessful: false,
  tokenPrices: {},
};

const gasCostSlice = createSlice({
  name: "gasCost",
  initialState,
  reducers: {
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
    builder.addCase(getGasPrice.pending, (state, action): GasCostState => {
      return {
        ...state,
        isFailed: false,
        isLoading: true,
        isSuccessful: false,
        gasPrice: undefined,
        swapTransactionCost: undefined,
      };
    });

    builder.addCase(getGasPrice.rejected, (state, action): GasCostState => {
      return {
        ...state,
        isFailed: true,
        isLoading: true,
        gasPrice: "0",
        swapTransactionCost: "0",
      };
    });

    builder.addCase(getGasPrice.fulfilled, (state, action): GasCostState => {
      return {
        ...state,
        isLoading: false,
        isSuccessful: true,
        gasPrice: action.payload.gasPrice,
        swapTransactionCost: action.payload.swapTransactionCost,
      };
    });

    builder.addCase(walletDisconnected, (): GasCostState => {
      return initialState;
    });
  },
});

export default gasCostSlice.reducer;
