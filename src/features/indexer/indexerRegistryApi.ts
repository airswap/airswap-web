import { Protocols } from "@airswap/constants";
import { RegistryV4 } from "@airswap/libraries";

import { providers } from "ethers";

export const getIndexerUrls = async (
  chainId: number,
  provider: providers.Provider
): Promise<string[]> => {
  return await RegistryV4.getServerURLs(
    provider,
    chainId,
    Protocols.StorageERC20
  );
};
