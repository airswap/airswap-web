import {
  ChainIds,
  chainNames,
  apiUrls,
  explorerUrls,
} from "@airswap/utils";

import { ChainParams } from "../types/chainParams";
import nativeCurrency from "./nativeCurrency";

export const supportedNetworks: number[] = [
  ChainIds.MAINNET,
  ChainIds.LINEA,
  ChainIds.POLYGON,
  ChainIds.ARBITRUM,
  ChainIds.AVALANCHE,
  ChainIds.BASE,
  ChainIds.TELOS,
  ChainIds.BSC,
  ChainIds.RSK,
];

const chainParams: { [key: number]: ChainParams } = {};
export const networkParams = supportedNetworks.map((chainId) => {
  chainParams[chainId] = {
    chainId: Number(chainId),
    chainName: chainNames[chainId],
    nativeCurrency: nativeCurrency[chainId],
    rpcUrls: [apiUrls[chainId]],
    blockExplorerUrls: [explorerUrls[chainId]],
  };
});
