import { ChainIds } from "@airswap/utils";

export const supportedNetworks: number[] = [
  ChainIds.MAINNET,
  ChainIds.SEPOLIA,
  ChainIds.LINEA,
  ChainIds.POLYGON,
  ChainIds.ARBITRUM,
  ChainIds.AVALANCHE,
  ChainIds.BASE,
  ChainIds.TELOS,
  ChainIds.BSC,
  ChainIds.RSK,
];

export type SupportedNetwork = typeof supportedNetworks[number];
