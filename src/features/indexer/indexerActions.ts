import { Server } from "@airswap/libraries";
import { FullOrderERC20, OrderFilter } from "@airswap/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { providers } from "ethers";

import { AppDispatch, RootState } from "../../app/store";
import { INDEXER_ORDER_RESPONSE_TIME_MS } from "../../constants/configParams";
import { getIndexerUrls } from "./indexerRegistryApi";

export const fetchIndexerUrls = createAsyncThunk<
  string[],
  { provider: providers.Provider },
  { dispatch: AppDispatch; state: RootState }
>("indexer/fetchIndexerUrls", async ({ provider }, { getState }) => {
  const { web3 } = getState();
  // First get a list of indexer nodes from the contract
  return await getIndexerUrls(web3.chainId!, provider);
});

export const getFilteredOrders = createAsyncThunk<
  FullOrderERC20[],
  { filter: Pick<OrderFilter, "senderToken" | "signerToken"> },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>("indexer/getFilteredOrders", async ({ filter }, { getState }) => {
  const { indexer: indexerState } = getState();
  let orders: FullOrderERC20[] = [];
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
        const orderResponse = await indexer.getOrdersERC20(
          {
            ...filter,
          },
          0,
          100
        );
        const ordersToAdd = orderResponse.orders;
        orders = { ...orders, ...ordersToAdd };
      } catch (e) {
        console.error(
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
    ]).then(() => orders);
  }
  return [];
});
