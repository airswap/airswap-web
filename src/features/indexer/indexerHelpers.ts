import { Server } from "@airswap/libraries";
import { FullOrderERC20 } from "@airswap/types";

export const sendOrderToIndexers = async (
  order: FullOrderERC20,
  indexerArray: string[]
) => {
  const indexers = indexerArray.map(async (url) => await Server.at(url));
  if (!indexers) throw new Error("No indexers available");

  const indexerPromises = await Promise.allSettled(indexers);
  const addOrderPromises = indexerPromises
    .filter(
      (value): value is PromiseFulfilledResult<Server> =>
        value.status === "fulfilled"
    )
    .map((value) => {
      const server = value.value;
      return server
        .addOrderERC20(order)
        .then(() => console.log(`Order added to ${server.locator}`))
        .catch((e: any) => {
          console.log(
            `[indexerSlice] Order indexing failed for ${server.locator}`,
            e.message || ""
          );
        });
    });

  Promise.race([
    Promise.allSettled(addOrderPromises),
    new Promise((res) => setTimeout(res, 4000)),
  ]);
};
