import {
  IndexedOrderResponse,
  NodeIndexer,
  RequestFilter,
  SortField,
  SortOrder,
} from "@airswap/libraries";
import { FullOrderERC20 } from "@airswap/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { INDEXER_ORDER_RESPONSE_TIME_MS } from "../../constants/configParams";
import { getIndexerOrders, getIndexerUrls } from "./indexerRegistryApi";

export interface IndexerState {
  /** List of indexer urls for servers that have responded successfully to
   * the healthcheck within the allowed time. Null during initial fetch. */
  indexerUrls: string[] | null;
  orders: FullOrderERC20[];
  isLoading: boolean;
  noIndexersFound: boolean;
}

const initialState: IndexerState = {
  indexerUrls: null,
  orders: [],
  isLoading: true,
  noIndexersFound: false,
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
  FullOrderERC20[],
  { filter: RequestFilter },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("indexer/getFilteredOrders", async ({ filter }, { getState }) => {
  const { indexer: indexerState } = getState();

  const indexers = indexerState.indexerUrls?.map((url) => new NodeIndexer(url));

  let orders: Record<string, IndexedOrderResponse> = {};

  const orderPromises = indexers?.map(async (indexer, i) => {
    try {
      const orderResponse = await indexer.getOrdersERC20By(filter);
      const ordersToAdd = orderResponse.orders;
      orders = { ...orders, ...ordersToAdd };
    } catch (e) {
      console.log(
        `[indexerSlice] Order request failed for ${
          indexerState.indexerUrls![i] || "an indexer node"
        }`,
        e || ""
      );
    }
  });

  return Promise.race([
    orderPromises && Promise.allSettled(orderPromises),
    new Promise((res) => setTimeout(res, INDEXER_ORDER_RESPONSE_TIME_MS)),
  ]).then(() => Object.entries(orders).map(([, order]) => order.order));
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
    builder.addCase(getFilteredOrders.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { reset } = indexerSlice.actions;
export const selectIndexerReducer = (state: RootState) => state.indexer;
export default indexerSlice.reducer;
