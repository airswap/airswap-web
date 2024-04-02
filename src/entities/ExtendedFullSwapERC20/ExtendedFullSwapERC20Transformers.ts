import { FullSwapERC20 } from "@airswap/utils/build/src/swap-erc20";

import { ExtendedFullSwapERC20 } from "./ExtendedFullSwapERC20";

export const transformToExtendedFullSwapERC20 = (
  swap: FullSwapERC20,
  hash: string,
  senderWallet: string,
  timestamp: number,
  status?: number
): ExtendedFullSwapERC20 => {
  return {
    hash,
    senderWallet,
    swap,
    timestamp,
    status,
  };
};
