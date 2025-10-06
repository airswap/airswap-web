import { ChainIds } from "@airswap/utils";

import { Alchemy, Network } from "alchemy-sdk";

const chainIdAlchemyChainRecord: Record<number, Network> = {
  [ChainIds.MAINNET]: Network.ETH_MAINNET,
  [ChainIds.POLYGON]: Network.MATIC_MAINNET,
  [ChainIds.BASE]: Network.BASE_MAINNET,
  [ChainIds.BASESEPOLIA]: Network.BASE_SEPOLIA,
  [ChainIds.SEPOLIA]: Network.ETH_SEPOLIA,
};

export const getAlchemyChain = (chainId: number): Network => {
  const alchemyChain = chainIdAlchemyChainRecord[chainId];

  if (!alchemyChain) {
    throw new Error(`Alchemy does not support chainId ${chainId}`);
  }

  return alchemyChain;
};

export const getAlchemyClient = (chainId: number) => {
  if (!process.env.REACT_APP_ALCHEMY_API_KEY) {
    throw new Error("REACT_APP_ALCHEMY_API_KEY is not set");
  }

  return new Alchemy({
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: getAlchemyChain(chainId),
  });
};
