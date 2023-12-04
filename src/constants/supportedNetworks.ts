import {
  ChainIds,
  chainNames,
  apiUrls,
  explorerUrls,
} from "@airswap/constants";

import { ChainParams } from "../types/chainParams";
import nativeCurrency from "./nativeCurrency";

export const supportedNetworks: number[] = [
  ChainIds.TELOS,
  ChainIds.TELOSTESTNET,
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
