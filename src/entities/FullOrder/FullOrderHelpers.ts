import { FullOrder, OrderERC20 } from "@airswap/utils";

export const isFullOrder = (value: any): value is FullOrder =>
  typeof value === "object" &&
  value !== null &&
  "signer" in value &&
  "sender" in value &&
  "affiliateWallet" in value &&
  "affiliateAmount" in value &&
  "v" in value &&
  "r" in value &&
  "s" in value;
