import { OrderERC20 } from "@airswap/utils";

export const isOrderERC20 = (value: any): value is OrderERC20 =>
  typeof value === "object" &&
  value !== null &&
  "nonce" in value &&
  "expiry" in value &&
  "signerWallet" in value &&
  "signerToken" in value &&
  "signerAmount" in value &&
  "senderToken" in value &&
  "senderAmount" in value &&
  "v" in value &&
  "r" in value &&
  "s" in value;
