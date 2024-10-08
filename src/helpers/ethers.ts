import { TransactionReceipt, Web3Provider } from "@ethersproject/providers";

import { rpcUrls } from "../constants/rpc";

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

export const getTransactionReceiptMined = (
  transactionHash: string,
  provider: Web3Provider
): Promise<TransactionReceipt | undefined> => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const receipt = await provider.getTransactionReceipt(transactionHash);

      if (receipt?.blockNumber) {
        clearInterval(interval);
        resolve(receipt);
      }
    }, 1000);
  });
};
