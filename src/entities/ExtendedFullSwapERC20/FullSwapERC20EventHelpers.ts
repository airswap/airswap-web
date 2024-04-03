import { FullSwapERC20Event } from "./FullSwapERC20Event";

export const isFullSwapERC20Event = (event: any): event is FullSwapERC20Event =>
  typeof event === "object" &&
  "hash" in event &&
  "senderWallet" in event &&
  "swap" in event &&
  "timestamp" in event;
