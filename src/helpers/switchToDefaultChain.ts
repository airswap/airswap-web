import { ChainIds } from "@airswap/constants";

import switchToChain from "./switchToChain";

const switchToDefaultChain = () => {
  try {
    switchToChain(ChainIds.TELOS);
  } catch (e) {
    // unable to switch network, but doesn't matter too much as button
    // looks like a call to action in this case anyway.
  }
};

export default switchToDefaultChain;
