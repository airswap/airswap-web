import { Web3Provider } from "@ethersproject/providers";

import { rpcUrls } from "../constants/rpc";
import { SupportedChain } from "../constants/supportedChains";

let cachedLibrary: Record<number, Web3Provider> = {};

export const setCachedLibrary = (
  provider: Web3Provider,
  chainId: number
): Web3Provider => {
  if (!cachedLibrary[chainId]) {
    cachedLibrary[chainId] = provider;
  }
  return cachedLibrary[chainId];
};

export const clearedCachedLibrary = (): void => {
  cachedLibrary = {};
};

export const getLibrary = (chainId: number): Web3Provider =>
  cachedLibrary[chainId];

export const getRpcUrl = (chainId: number): string | undefined => {
  const rpcUrl = rpcUrls[chainId as SupportedChain] as string;

  if (!rpcUrl) {
    console.error(
      `No rpc url found for chainId ${chainId}, did you setup your .env correctly?`
    );

    return undefined;
  }

  return rpcUrl;
};
