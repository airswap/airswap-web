import {
  IndexedOrderResponse,
  NodeIndexer,
  OrderResponse,
  RequestFilter,
} from "@airswap/libraries";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import {
  INDEXER_NODE_MAX_HEALTHCHECK_RESPONSE_TIME_MS,
  INDEXER_ORDER_RESPONSE_TIME_MS,
} from "../../constants/configParams";
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
  const indexerUrls = await getIndexerUrls(wallet.chainId!, provider);

  // Next build a list of indexers that response within a threshold time
  const healthyIndexerUrls = [];

  const indexers = indexerUrls.map((url) => new NodeIndexer(url));

  await Promise.race([
    // This promise resolves when all indexer healthchecks have settled.
    Promise.allSettled(
      indexers.map((indexer, i) =>
        indexer
          .getHealthCheck()
          .then(() => healthyIndexerUrls.push(indexerUrls[i]))
          .catch((e) =>
            console.log(
              `[indexerSlice] Healthcheck failed for ${indexerUrls[i]}`,
              e.message || ""
            )
          )
      )
    ),
    // This promise resolves after the maximum wait time
    new Promise((res) =>
      setTimeout(res, INDEXER_NODE_MAX_HEALTHCHECK_RESPONSE_TIME_MS)
    ),
  ]);
  return indexerUrls;
});

export const getFilteredOrders = createAsyncThunk<
  OrderResponse["orders"],
  { filter: RequestFilter },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("indexer/getFilteredOrders", async ({ filter }, { getState }) => {
  const { indexer: indexerState } = getState();

  const indexers = indexerState.indexerUrls?.map((url) => new NodeIndexer(url));
  if (!indexers) throw new Error("No indexers available");

  const orders: Record<string, IndexedOrderResponse> = {};

  // Get orders from all indexers in parallel
  const orderPromises = indexers.map((indexer, i) =>
    indexer
      .getOrdersBy(filter)
      .then((response) => {
        Object.assign(orders, response.orders);
      })
      .catch((e) => {
        console.log(
          `[indexerSlice] Order request failed for ${indexerState.indexerUrls?.[i]}`,
          e.message || ""
        );
      })
  );

  // Implement a timeout so we don't wait indefinitely
  Promise.race([
    Promise.allSettled(orderPromises),
    new Promise((res) => setTimeout(res, INDEXER_ORDER_RESPONSE_TIME_MS)),
  ]);

  //  Return the orders we have.
  return orders;
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
      state.indexerUrls = action.payload;
    });
    builder.addCase(getFilteredOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  },
});

export const { reset } = indexerSlice.actions;
export default indexerSlice.reducer;
