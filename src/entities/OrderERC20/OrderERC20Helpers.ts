import {
  FullOrder,
  FullOrderERC20,
  OrderERC20,
  TokenKinds,
} from "@airswap/utils";

import { RFQ_EXPIRY_BUFFER_MS } from "../../constants/configParams";
import { isFullOrder } from "../FullOrder/FullOrderHelpers";

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
export const isFullOrderERC20 = (value: any): value is FullOrderERC20 =>
  typeof value === "object" &&
  value !== null &&
  "signerWallet" in value &&
  "senderWallet" in value &&
  "signerToken" in value &&
  "senderToken" in value &&
  "signerAmount" in value &&
  "senderAmount" in value &&
  "protocolFee" in value &&
  "v" in value &&
  "r" in value &&
  "s" in value;

export const getOrderSignerWallet = (
  order: OrderERC20 | FullOrderERC20 | FullOrder
): string => {
  return isFullOrder(order) ? order.signer.wallet : order.signerWallet;
};

export const getOrderSignerAmount = (
  order: OrderERC20 | FullOrderERC20 | FullOrder
): string => {
  return isFullOrder(order) ? order.signer.amount : order.signerAmount;
};

export const getOrderSenderAmount = (
  order: OrderERC20 | FullOrderERC20 | FullOrder
): string => {
  return isFullOrder(order) ? order.sender.amount : order.senderAmount;
};

export const getOrderSenderToken = (
  order: OrderERC20 | FullOrderERC20 | FullOrder
): string => {
  return isFullOrder(order) ? order.sender.token : order.senderToken;
};

export const getOrderSignerToken = (
  order: OrderERC20 | FullOrderERC20 | FullOrder
): string => {
  return isFullOrder(order) ? order.signer.token : order.signerToken;
};

export const getOrderSenderTokenId = (
  order: OrderERC20 | FullOrderERC20 | FullOrder
): string | undefined => {
  return isFullOrder(order) && order.sender.kind !== TokenKinds.ERC20
    ? order.sender.id
    : undefined;
};

export const getOrderSignerTokenId = (
  order: OrderERC20 | FullOrderERC20 | FullOrder
): string | undefined => {
  return isFullOrder(order) && order.signer.kind !== TokenKinds.ERC20
    ? order.signer.id
    : undefined;
};
