import { BigNumber } from "bignumber.js";
import { BigNumber as EthersBigNumber } from "ethers";
import i18n from "i18next";

import { getTokenId } from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
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

const getOrdersTotalApprovalAmount = (orders: MyOrder[]) => {
  return orders.reduce((acc, order) => {
    if (!order.signerToken || order.status !== OrderStatus.open) {
      return acc;
    }

    const tokenId = getTokenId(order.signerToken);

    const currentAmount = acc[tokenId] || "0";
    acc[tokenId] = EthersBigNumber.from(currentAmount)
      .add(EthersBigNumber.from(order.signerAmount))
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

    const hasAllowanceWarning = EthersBigNumber.from(approvedAmount).lt(
      EthersBigNumber.from(tokensAmount)
    );

    return {
      ...order,
      hasAllowanceWarning,
    } as MyOrder;
  });
};
