import {
  IndexedOrderResponse,
  NodeIndexer,
  SortOrder,
} from "@airswap/libraries";
import { FullOrderERC20 } from "@airswap/types";

import BigNumber from "bignumber.js";

export const sendOrderToIndexers = (
  order: FullOrderERC20,
  indexerArray: string[]
) => {
  const indexers = indexerArray.map((url) => new NodeIndexer(url));
  if (!indexers) throw new Error("No indexers available");

  // Send order to all indexers
  const addOrderPromises = indexers.map((indexer) =>
    indexer
      .addOrderERC20(order)
      .then(() => console.log(`Order added to ${indexer}`))
      .catch((e) => {
        console.log(
          `[indexerSlice] Order indexing failed for ${indexer}`,
          e.message || ""
        );
      })
  );

  Promise.race([
    Promise.allSettled(addOrderPromises),
    new Promise((res) => setTimeout(res, 4000)),
  ]);
};

export const sortIndexerOrders = (
  orders: Record<string, IndexedOrderResponse>,
  sortDirection: "ASC" | "DESC",
  sortField: "SENDER" | "SIGNER" | "RATE"
) => {
  if (sortField === "SENDER") {
    return Object.entries(orders).sort((a, b) => {
      return (
        parseInt(a[1].order.senderAmount) - parseInt(b[1].order.senderAmount)
      );
    });
  }
};
