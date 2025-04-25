import {
  compressFullOrder,
  compressFullOrderERC20,
  FullOrder,
  FullOrderERC20,
} from "@airswap/utils";

import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import { isFullOrder } from "../../../../entities/FullOrder/FullOrderHelpers";
import { routes } from "../../../../routes";
import { OrderStatus } from "../../../../types/orderStatus";
import { MyOrder } from "./MyOrder";

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
    link: routes.otcOrder(compressedOrder),
    status: status,
    chainId: order.chainId,
    senderToken,
    senderAmount: isFullOrder(order) ? order.sender.amount : order.senderAmount,
    signerToken,
    signerAmount: isFullOrder(order) ? order.signer.amount : order.signerAmount,
    expiry: new Date(Number(order.expiry) * 1000),
  };
};
