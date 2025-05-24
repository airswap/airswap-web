import {
  FullOrder,
  FullOrderERC20,
  getTokenInfo,
  TokenKinds,
} from "@airswap/utils";

import * as ethers from "ethers";
import { BigNumber } from "ethers";

import { AppTokenInfo } from "../../../../../../entities/AppTokenInfo/AppTokenInfo";
import {
  findTokenByAddressAndId,
  getTokenId,
} from "../../../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { isFullOrder } from "../../../../../../entities/FullOrder/FullOrderHelpers";
import { BalanceValues } from "../../../../../../features/balances/balancesSlice";
import { getNonceUsed } from "../../../../../../features/orders/ordersHelpers";
import { OrderStatus } from "../../../../../../types/orderStatus";
import { MyOrder } from "../../../../MyOrdersWidget/entities/MyOrder";
import { transformFullOrderToMyOrder } from "../../../../MyOrdersWidget/entities/MyOrderTransformers";

export const findTokenInfo = async (
  token: string,
  activeTokens: AppTokenInfo[],
  provider: ethers.providers.BaseProvider,
  tokenId?: string
): Promise<AppTokenInfo | undefined> => {
  const activeToken = findTokenByAddressAndId(activeTokens, token, tokenId);

  if (activeToken) {
    return activeToken;
  }

  try {
    const tokenInfo = await getTokenInfo(provider, token);

    return {
      ...tokenInfo,
      address: tokenInfo.address.toLowerCase(),
    };
  } catch (error) {
    console.error("[findTokenInfo] Error fetching token info", error);

    return undefined;
  }
};

const callGetNonceUsed = async (
  order: FullOrder | FullOrderERC20,
  provider: ethers.providers.BaseProvider
): Promise<boolean> => {
  try {
    return getNonceUsed(order, provider);
  } catch (error) {
    console.error("[callGetNonceUsed] Error fetching nonce used", error);

    return false;
  }
};

const transformToOrderStatus = (
  isTaken: boolean,
  isExpired: boolean,
  isCanceled: boolean
): OrderStatus => {
  if (isCanceled) {
    return OrderStatus.canceled;
  }

  if (isTaken) {
    return OrderStatus.taken;
  }

  if (isExpired) {
    return OrderStatus.expired;
  }

  return OrderStatus.open;
};

export const getFullOrderDataAndTransformToOrder = async (
  order: FullOrder | FullOrderERC20,
  activeTokens: AppTokenInfo[],
  provider: ethers.providers.BaseProvider
): Promise<MyOrder> => {
  const signerToken = await findTokenInfo(
    isFullOrder(order) ? order.signer.token : order.signerToken,
    activeTokens,
    provider,
    isFullOrder(order) && order.signer.kind !== TokenKinds.ERC20
      ? order.signer.id
      : undefined
  );
  const senderToken = await findTokenInfo(
    isFullOrder(order) ? order.sender.token : order.senderToken,
    activeTokens,
    provider
  );

  const isTaken = await callGetNonceUsed(order, provider);
  const isExpired = new Date().getTime() > parseInt(order.expiry) * 1000;
  const status = transformToOrderStatus(isTaken, isExpired, false);

  return transformFullOrderToMyOrder(order, status, signerToken, senderToken);
};

export const getOrdersTotalApprovalAmount = (orders: MyOrder[]) => {
  return orders.reduce((acc, order) => {
    if (!order.signerToken || order.status !== OrderStatus.open) {
      return acc;
    }

    const tokenId = getTokenId(order.signerToken);

    const currentAmount = acc[tokenId] || "0";
    acc[tokenId] = BigNumber.from(currentAmount)
      .add(BigNumber.from(order.signerAmount))
      .toString();

    return acc;
  }, {} as BalanceValues);
};

export const getOrdersWithApprovalWarnings = (
  orders: MyOrder[],
  allowances: BalanceValues
) => {
  const tokenApprovals = getOrdersTotalApprovalAmount(orders);

  return orders.map((order) => {
    if (!order.signerToken) {
      return order;
    }

    const tokenId = getTokenId(order.signerToken);
    const approvedAmount = allowances[tokenId] || "0";
    const tokensAmount = tokenApprovals[tokenId] || "0";

    const hasAllowanceWarning = BigNumber.from(approvedAmount).lt(
      BigNumber.from(tokensAmount)
    );

    return {
      ...order,
      hasAllowanceWarning,
    } as MyOrder;
  });
};
