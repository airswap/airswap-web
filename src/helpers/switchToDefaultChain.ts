import { ChainIds } from "@airswap/constants";

import { SUPPORTED_NETWORKS } from "../constants/supportedNetworks";
import switchToChain from "./switchToChain";

const switchToDefaultChain = () => {
  try {
    switchToChain(SUPPORTED_NETWORKS[0] || ChainIds.MAINNET);
  } catch (e) {
    // unable to switch network, but doesn't matter too much as button
    // looks like a call to action in this case anyway.
  }
};

export default switchToDefaultChain;
