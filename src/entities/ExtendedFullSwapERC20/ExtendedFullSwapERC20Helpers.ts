import { ExtendedFullSwapERC20 } from "./ExtendedFullSwapERC20";

export const isExtendedFullSwapERC20Event = (
  event: any
): event is ExtendedFullSwapERC20 =>
  typeof event === "object" &&
  "hash" in event &&
  "senderWallet" in event &&
  "swap" in event &&
  "timestamp" in event;
