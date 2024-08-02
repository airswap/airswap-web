import { FullOrderERC20, OrderERC20 } from "@airswap/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { fetchIndexerUrls, getFilteredOrders } from "./indexerActions";

export interface IndexerState {
  /** List of indexer urls for servers that have responded successfully to
   * the healthcheck within the allowed time. Null during initial fetch. */
  indexerUrls: string[] | null;
  orders: FullOrderERC20[];
  bestSwapOrder: OrderERC20 | null;
  isLoading: boolean;
  noIndexersFound: boolean;
}

const initialState: IndexerState = {
  indexerUrls: null,
  orders: [],
  bestSwapOrder: null,
  isLoading: false,
  noIndexersFound: false,
};

export const indexerSlice = createSlice({
  name: "indexer",
  initialState,
  reducers: {
    reset: () => {
      return { ...initialState };
    },
    setBestSwapOrder: (state, action: PayloadAction<OrderERC20 | null>) => {
      state.bestSwapOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIndexerUrls.fulfilled, (state, action) => {
      if (state.indexerUrls?.length && !action.payload.length) {
        return;
      }

      state.indexerUrls = action.payload;

      if (!state.indexerUrls.length) {
        state.noIndexersFound = true;
      }
    });
    builder.addCase(getFilteredOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getFilteredOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getFilteredOrders.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { reset, setBestSwapOrder } = indexerSlice.actions;
export const selectIndexerReducer = (state: RootState) => state.indexer;
export default indexerSlice.reducer;
