import { ProtocolIds } from "@airswap/utils";
import { Registry } from "@airswap/libraries";

import { providers } from "ethers";

export const getIndexerUrls = async (
  chainId: number,
  provider: providers.Provider
): Promise<string[]> => {
  return await Registry.getServerURLs(
    provider,
    chainId,
    ProtocolIds.IndexingERC20
  );
};
