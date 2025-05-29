import {
  compressFullOrder,
  compressFullOrderERC20,
  FullOrder,
  FullOrderERC20,
  TokenKinds,
} from "@airswap/utils";

import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import { isFullOrder } from "../../../../entities/FullOrder/FullOrderHelpers";
import { routes } from "../../../../routes";
import { OrderStatus } from "../../../../types/orderStatus";
import { MyOrder } from "./MyOrder";

const getFullOrderAmount = (
  party: FullOrder["signer"] | FullOrder["sender"]
): string => {
  if (party.kind === TokenKinds.ERC721) {
    return "1";
  }

  return party.amount;
};

export const transformFullOrderToMyOrder = (
  order: FullOrder | FullOrderERC20,
  status: OrderStatus,
  signerToken?: AppTokenInfo,
  senderToken?: AppTokenInfo
): MyOrder => {
  const compressedOrder = isFullOrder(order)
    ? compressFullOrder(order)
    : compressFullOrderERC20(order);

  return {
    id: order.nonce,
    type: isFullOrder(order) ? "full" : "fullERC20",
    hasAllowanceWarning: false,
    link: routes.otcOrder(compressedOrder),
    status: status,
    chainId: order.chainId,
    for: isFullOrder(order) ? order.sender.wallet : order.senderWallet,
    senderToken,
    senderAmount: isFullOrder(order)
      ? getFullOrderAmount(order.sender)
      : order.senderAmount,
    signerToken,
    signerAmount: isFullOrder(order)
      ? getFullOrderAmount(order.signer)
      : order.signerAmount,
    expiry: new Date(Number(order.expiry) * 1000),
  };
};
