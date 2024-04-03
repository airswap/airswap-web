import { FullSwapERC20 } from "@airswap/utils/build/src/swap-erc20";

import { FullSwapERC20Event } from "./FullSwapERC20Event";

export const transformToFullSwapERC20Event = (
  swap: FullSwapERC20,
  hash: string,
  senderWallet: string,
  timestamp: number,
  status?: number
): FullSwapERC20Event => {
  return {
    hash,
    senderWallet,
    swap,
    timestamp,
    status,
  };
};
