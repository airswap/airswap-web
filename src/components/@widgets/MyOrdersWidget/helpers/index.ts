import { BigNumber } from "bignumber.js";
import i18n from "i18next";

import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenId,
  isTokenInfo,
} from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { isFullOrder } from "../../../../entities/FullOrder/FullOrderHelpers";
import { isFullOrderERC20 } from "../../../../entities/OrderERC20/OrderERC20Helpers";
import { BalanceValues } from "../../../../features/balances/balancesSlice";
import { OrderStatus } from "../../../../types/orderStatus";
import { MyOrder } from "../entities/MyOrder";

export const getTokenAmountWithDecimals = (
  amount: string,
  decimals = 18
): BigNumber => {
  return new BigNumber(amount).div(10 ** decimals);
};

export const getOrderStatusTranslation = (status: OrderStatus): string => {
  if (status === OrderStatus.canceled) {
    return i18n.t("common.canceled");
  }

  if (status === OrderStatus.taken) {
    return i18n.t("common.taken");
  }

  if (status === OrderStatus.expired) {
    return i18n.t("common.expired");
  }

  if (status === OrderStatus.filled) {
    return i18n.t("common.filled");
  }

  return i18n.t("common.active");
};

const getOrdersTotalApprovalAmount = (
  orders: MyOrder[],
  protocolFee?: number
) => {
  return orders.reduce((acc, order) => {
    const makerToken = getOrderMakerToken(order);
    if (!makerToken || order.status !== OrderStatus.open) {
      return acc;
    }

    const tokenId = getTokenId(makerToken);
    const makerAmount =
      order.type === "delegate" ? order.senderAmount : order.signerAmount;

    const currentAmount = acc[tokenId] || "0";
    const shouldPayProtocolFee = protocolFee && order.type === "fullERC20";
    const orderAmount = shouldPayProtocolFee
      ? new BigNumber(makerAmount)
          .multipliedBy(1 + protocolFee / 10000)
          .toString()
      : makerAmount;

    acc[tokenId] = new BigNumber(currentAmount).plus(orderAmount).toString();

    return acc;
  }, {} as BalanceValues);
};

const getOrderMakerToken = (order: MyOrder): AppTokenInfo | undefined => {
  if (order.type === "delegate") {
    return order.senderToken;
  }

  return order.signerToken;
};

export const getOrdersWithApprovalWarnings = (
  orders: MyOrder[],
  allowances: BalanceValues,
  protocolFee?: number
) => {
  const tokenApprovals = getOrdersTotalApprovalAmount(orders, protocolFee);

  return orders.map((order) => {
    const makerToken = getOrderMakerToken(order);
    if (!makerToken) {
      return order;
    }

    const tokenId = getTokenId(makerToken);
    const approvedAmount = allowances[tokenId] || "0";
    const tokensAmount = tokenApprovals[tokenId] || "0";

    const hasAllowanceWarning =
      order.status === OrderStatus.open &&
      new BigNumber(approvedAmount).lt(new BigNumber(tokensAmount));

    return {
      ...order,
      hasAllowanceWarning,
    } as MyOrder;
  });
};
