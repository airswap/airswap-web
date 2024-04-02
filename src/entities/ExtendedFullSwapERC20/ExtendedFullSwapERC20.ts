import { FullSwapERC20 } from "@airswap/utils/build/src/swap-erc20";

export interface ExtendedFullSwapERC20 {
  hash: string;
  senderWallet: string;
  status?: number;
  swap: FullSwapERC20;
  timestamp: number;
}
