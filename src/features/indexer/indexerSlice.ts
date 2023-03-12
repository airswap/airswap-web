import {
  IndexedOrderResponse,
  NodeIndexer,
  RequestFilter,
} from "@airswap/libraries";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { getIndexerUrls } from "./indexerRegistryApi";

export interface IndexerState {
  /** List of indexer urls for servers that have responded successfully to
   * the healthcheck within the allowed time. Null during initial fetch. */
  indexerUrls: string[] | null;
  /** Map of order hash -> fullorder */
  orders: Record<string, IndexedOrderResponse>;
}

const initialState: IndexerState = {
  indexerUrls: null,
  orders: {},
};

export const fetchIndexerUrls = createAsyncThunk<
  string[],
  { provider: providers.Provider },
  { dispatch: AppDispatch; state: RootState }
>("indexer/fetchIndexerUrls", async ({ provider }, { getState }) => {
  const { wallet } = getState();
  // First get a list of indexer nodes from the contract
  return await getIndexerUrls(wallet.chainId!, provider);
});

export const getFilteredOrders = createAsyncThunk<
  any,
  { filter: RequestFilter },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("indexer/getFilteredOrders", async ({ filter }, { getState }) => {
  // const { indexer: indexerState } = getState();

  const indexer = new NodeIndexer("http://airswap.mitsi.ovh/");

  return (await indexer.getOrdersERC20By(filter)).orders;
});

export const indexerSlice = createSlice({
  name: "indexer",
  initialState,
  reducers: {
    reset: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIndexerUrls.fulfilled, (state, action) => {
      console.log("indexer fulfilled!");
      state.indexerUrls = action.payload;
    });
    builder.addCase(getFilteredOrders.fulfilled, (state, action) => {
      console.log("orders fulfilled!");
      state.orders = action.payload;
    });
  },
});

export const { reset } = indexerSlice.actions;
export const selectIndexerReducer = (state: RootState) => state.indexer;
export default indexerSlice.reducer;
