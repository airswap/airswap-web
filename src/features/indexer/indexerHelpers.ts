import { NodeIndexer } from "@airswap/libraries";
import { FullOrderERC20 } from "@airswap/types";

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
