import {
  IndexedOrderResponse,
  IndexerRegistry,
  NodeIndexer,
  RequestFilter,
} from "@airswap/libraries";
import { FullOrderERC20 } from "@airswap/types";

import { providers } from "ethers";

import { INDEXER_ORDER_RESPONSE_TIME_MS } from "../../constants/configParams";

export const getIndexerUrls = async (
  chainId: number,
  provider: providers.Provider
): Promise<string[]> => {
  const indexerRegistry = new IndexerRegistry(chainId, provider);
  return await indexerRegistry.contract.getURLs();
};

export const getIndexerOrders = async (
  indexers: NodeIndexer[] | undefined,
  filter: RequestFilter
) => {
  if (indexers) {
    let orders: Record<string, IndexedOrderResponse> = {};

    const orderPromises = indexers?.map(async (indexer, i) => {
      try {
        const orderResponse = await indexer.getOrdersERC20By(filter);
        const ordersToAdd = orderResponse.orders;
        orders = { ...orders, ...ordersToAdd };
      } catch (e) {
        console.log(
          `[indexerSlice] Order request failed for ${indexers[i]}`,
          e || ""
        );
      }
    });

    return Promise.race([
      Promise.allSettled(orderPromises),
      new Promise((res) => setTimeout(res, INDEXER_ORDER_RESPONSE_TIME_MS)),
    ]).then(() => Object.entries(orders).map(([, order]) => order.order));
  }
};
