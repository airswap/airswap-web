import { Protocols } from "@airswap/constants";
import { Registry } from "@airswap/libraries";

import { providers } from "ethers";

export const getIndexerUrls = async (
  chainId: number,
  provider: providers.Provider
): Promise<string[]> => {
  return await Registry.getServerURLs(
    provider,
    chainId,
    Protocols.IndexingERC20
  );
};
