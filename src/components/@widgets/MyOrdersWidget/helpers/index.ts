import { BigNumber } from "bignumber.js";
import i18n from "i18next";

import {
  getTokenId,
  isTokenInfo,
} from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
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
    if (!order.signerToken || order.status !== OrderStatus.open) {
      return acc;
    }

    const tokenId = getTokenId(order.signerToken);

    const currentAmount = acc[tokenId] || "0";
    const shouldPayProtocolFee = protocolFee && isTokenInfo(order.signerToken);
    const orderAmount = shouldPayProtocolFee
      ? new BigNumber(order.signerAmount)
          .multipliedBy(1 + protocolFee / 10000)
          .toString()
      : order.signerAmount;

    acc[tokenId] = new BigNumber(currentAmount).plus(orderAmount).toString();

    return acc;
  }, {} as BalanceValues);
};

export const getOrdersWithApprovalWarnings = (
  orders: MyOrder[],
  allowances: BalanceValues,
  protocolFee?: number
) => {
  const tokenApprovals = getOrdersTotalApprovalAmount(orders, protocolFee);

  return orders.map((order) => {
    if (!order.signerToken) {
      return order;
    }

    const tokenId = getTokenId(order.signerToken);
    const approvedAmount = allowances[tokenId] || "0";
    const tokensAmount = tokenApprovals[tokenId] || "0";

    const hasAllowanceWarning = new BigNumber(approvedAmount).lt(
      new BigNumber(tokensAmount)
    );

    return {
      ...order,
      hasAllowanceWarning,
    } as MyOrder;
  });
};
