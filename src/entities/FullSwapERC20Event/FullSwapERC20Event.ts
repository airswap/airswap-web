import { FullSwapERC20 } from "@airswap/utils/build/src/swap-erc20";

export interface FullSwapERC20Event {
  name: "Swap";
  hash: string;
  senderWallet: string;
  status?: number;
  swap: FullSwapERC20;
  timestamp: number;
}
