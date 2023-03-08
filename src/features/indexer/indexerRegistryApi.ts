import { IndexerRegistry } from "@airswap/libraries";

import { providers } from "ethers";

export const getIndexerUrls = async (
  chainId: number,
  provider: providers.Provider
): Promise<string[]> => {
  const indexerRegistry = new IndexerRegistry(chainId, provider);
  return await indexerRegistry.contract.getURLs();
};
