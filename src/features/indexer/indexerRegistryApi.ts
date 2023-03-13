import {
  IndexedOrderResponse,
  IndexerRegistry,
  NodeIndexer,
  RequestFilter,
} from "@airswap/libraries";

import { providers } from "ethers";

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

    const orderPromises = indexers?.map(async (indexer) => {
      const orderResponse = await indexer.getOrdersERC20By(filter);
      const ordersToAdd = orderResponse.orders;
      orders = { ...orders, ...ordersToAdd };
    });

    return Promise.race([
      Promise.allSettled(orderPromises).then(() => {
        return orders;
      }),
      new Promise((res) => setTimeout(res, 4000)).then(() => {
        return orders;
      }),
    ]);
  }
};
