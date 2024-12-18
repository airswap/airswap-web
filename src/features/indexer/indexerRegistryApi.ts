import { Registry } from "@airswap/libraries";
import { ProtocolIds } from "@airswap/utils";

import { providers } from "ethers";

export const getIndexerUrls = async (
  chainId: number,
  provider: providers.Provider
): Promise<string[]> => {
  const urls = await Registry.getServerURLs(
    provider,
    chainId,
    ProtocolIds.IndexingERC20
  );

  return urls.map((url) => url.url);
};
