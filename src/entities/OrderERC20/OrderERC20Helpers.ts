import { OrderERC20 } from "@airswap/utils";

import { RFQ_EXPIRY_BUFFER_MS } from "../../constants/configParams";

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

export const getOrderExpiryWithBufferInSeconds = (
  expiry: OrderERC20["expiry"]
) => {
  return parseInt(expiry) - RFQ_EXPIRY_BUFFER_MS / 1000;
};
