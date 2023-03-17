import {
  NodeIndexer,
  RequestFilter,
  SortField,
  SortOrder,
} from "@airswap/libraries";
import { FullOrderERC20 } from "@airswap/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import i18n from "../../i18n/i18n";
import { getIndexerOrders, getIndexerUrls } from "./indexerRegistryApi";

export interface IndexerState {
  /** List of indexer urls for servers that have responded successfully to
   * the healthcheck within the allowed time. Null during initial fetch. */
  indexerUrls: string[] | null;
  /** Map of order hash -> fullorder */
  orders: FullOrderERC20[];
  errorText: string | null;
}

const initialState: IndexerState = {
  indexerUrls: null,
  orders: [],
  errorText: null,
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

  const indexers = indexerState.indexerUrls?.map(
    (indexer) => new NodeIndexer(indexer)
  );

  return await getIndexerOrders(indexers, {
    ...filter,
    sortField: SortField.SIGNER_AMOUNT,
    sortOrder: SortOrder.DESC,
  });
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
      if (!action.payload.length) {
        state.errorText = i18n.t("orders.noIndexersFound");
      }
    });
    builder.addCase(getFilteredOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
      if (!action.payload.length) {
        state.errorText = i18n.t("orders.noIndexerOrdersFound");
      }
    });
    builder.addCase(getFilteredOrders.rejected, (state) => {
      if (!state.orders.length) {
        state.errorText = i18n.t("orders.noIndexerOrdersFound");
      }
    });
  },
});

export const { reset } = indexerSlice.actions;
export const selectIndexerReducer = (state: RootState) => state.indexer;
export default indexerSlice.reducer;
