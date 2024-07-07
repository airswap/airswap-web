import { Server, RegistryV3, Registry } from "@airswap/libraries";
import { ProtocolIds } from "@airswap/utils";
import { BaseProvider } from "@ethersproject/providers";

import { REGISTRY_SERVER_RESPONSE_TIME_MS } from "../../constants/configParams";
import { isServer } from "./ServerHelpers";

export const getVersionedRegistryServers = (
  provider: BaseProvider,
  chainId: number,
  protocol: ProtocolIds,
  quoteToken: string,
  baseToken: string
): Promise<Server[]> => {
  if (RegistryV3.addresses[chainId]) {
    return RegistryV3.getServers(provider, chainId, quoteToken, baseToken);
  }

  return Registry.getServers(
    provider,
    chainId,
    protocol,
    quoteToken,
    baseToken
  );
};

export const getRegistryServers = async (
  provider: BaseProvider,
  chainId: number,
  protocol: ProtocolIds,
  quoteToken: string,
  baseToken: string
): Promise<Server[]> => {
  try {
    const response = await Promise.race([
      getVersionedRegistryServers(
        provider,
        chainId,
        protocol,
        quoteToken,
        baseToken
      ),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout")),
          REGISTRY_SERVER_RESPONSE_TIME_MS
        )
      ),
    ]);

    if (Array.isArray(response) && response.every(isServer)) {
      return response;
    }

    return [];
  } catch (error) {
    console.error(
      "[getRegistryServers] Error fetching servers from registry",
      error
    );

    return [];
  }
};
