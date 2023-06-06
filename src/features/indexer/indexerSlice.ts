import { Server } from "@airswap/libraries";
import {
  IndexedOrder,
  FullOrderERC20,
  OrderFilter,
  OrderERC20,
} from "@airswap/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

import { providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { INDEXER_ORDER_RESPONSE_TIME_MS } from "../../constants/configParams";
import { getIndexerUrls } from "./indexerRegistryApi";

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
  { filter: Pick<OrderFilter, "senderTokens" | "signerTokens"> },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("indexer/getFilteredOrders", async ({ filter }, { getState }) => {
  const { indexer: indexerState } = getState();
  let orders: Record<string, IndexedOrder<FullOrderERC20>> = {};
  if (indexerState.indexerUrls) {
    const serverPromises = await Promise.allSettled(
      indexerState.indexerUrls.map((url) => Server.at(url))
    );
    const servers: Server[] = serverPromises
      .filter(
        (value): value is PromiseFulfilledResult<Server> =>
          value.status === "fulfilled"
      )
      .map((value) => value.value);

    const orderPromises = servers.map(async (indexer, i) => {
      try {
        const orderResponse = await indexer.getOrdersERC20({
          ...filter,
          offset: 0,
          limit: 100,
        });
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
  }
  return [];
});

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
