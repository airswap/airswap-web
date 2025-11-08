import { FC, useCallback, useEffect, useState } from "react";

import { FullOrder, FullOrderERC20 } from "@airswap/utils";

import * as ethers from "ethers";

import { useAppSelector } from "../../../../../app/hooks";
import { AppTokenInfo } from "../../../../../entities/AppTokenInfo/AppTokenInfo";
import { isTokenInfo } from "../../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { DelegateRule } from "../../../../../entities/DelegateRule/DelegateRule";
import { Allowances } from "../../../../../features/balances/balancesTypes";
import {
  selectAllTokenInfo,
  selectProtocolFee,
} from "../../../../../features/metadata/metadataSlice";
import { OrdersSortType } from "../../../../../types/ordersSortType";
import { getDelegateRuleDataAndTransformToMyOrder } from "../../../MyLimitOrdersWidget/subcomponents/MyLimitOrdersList/helpers";
import { MyOrder } from "../../../MyOrdersWidget/entities/MyOrder";
import { getOrdersWithApprovalWarnings } from "../../../MyOrdersWidget/helpers";
import MyOrdersList from "../../../MyOrdersWidget/subcomponents/MyOrdersList/MyOrdersList";
import { getFullOrderDataAndTransformToOrder } from "./helpers";

interface MyOtcOrdersListProps {
  isAllowancesLoading: boolean;
  activeCancellationId?: string;
  activeSortType: OrdersSortType;
  activeTokens: AppTokenInfo[];
  allowances: Allowances;
  delegateRules: DelegateRule[];
  fullOrders: (FullOrder | FullOrderERC20)[];
  sortTypeDirection: Record<OrdersSortType, boolean>;
  library: ethers.providers.BaseProvider;
  onDeleteDelegateRuleOrderButtonClick: (
    order: DelegateRule,
    myOrder: MyOrder
  ) => void;
  onDeleteOrderButtonClick: (
    order: FullOrder | FullOrderERC20,
    myOrder: MyOrder
  ) => void;
  className?: string;
}

const MyOtcOrdersList: FC<MyOtcOrdersListProps> = ({
  isAllowancesLoading,
  activeCancellationId,
  activeSortType,
  allowances,
  delegateRules,
  fullOrders,
  library,
  sortTypeDirection,
  onDeleteDelegateRuleOrderButtonClick,
  onDeleteOrderButtonClick,
  className,
}) => {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeTokens = useAppSelector(selectAllTokenInfo);
  const protocolFee = useAppSelector(selectProtocolFee);

  const callGetOrders = useCallback(async () => {
    const newOtcOrders = await Promise.all(
      fullOrders.map((order) =>
        getFullOrderDataAndTransformToOrder(order, activeTokens, library)
      )
    );

    const newDelegateRuleOrders = await Promise.all(
      delegateRules.map((order) =>
        getDelegateRuleDataAndTransformToMyOrder(order, activeTokens, library)
      )
    );

    const erc20OrdersWithApprovalWarnings = getOrdersWithApprovalWarnings(
      newOtcOrders.filter(
        (order) => order.signerToken && isTokenInfo(order.signerToken)
      ),
      allowances.swapERC20.values,
      protocolFee
    );
    const fullOrdersWithApprovalWarnings = getOrdersWithApprovalWarnings(
      newOtcOrders.filter(
        (order) => !order.signerToken || !isTokenInfo(order.signerToken)
      ),
      allowances.swap.values
    );
    const delegateRuleOrdersWithApprovalWarnings =
      getOrdersWithApprovalWarnings(
        newDelegateRuleOrders.filter((order) => order.senderToken),
        allowances.delegate.values
      );

    const ordersWithApprovalWarnings = [
      ...erc20OrdersWithApprovalWarnings,
      ...fullOrdersWithApprovalWarnings,
      ...delegateRuleOrdersWithApprovalWarnings,
    ];

    setOrders(ordersWithApprovalWarnings);
    setIsLoading(false);
  }, [fullOrders, activeTokens]);

  const handleDeleteOrderButtonClick = (order: MyOrder): void => {
    if (order.type === "delegate") {
      const delegateRuleToDelete = delegateRules.find((o) => o.id === order.id);

      if (delegateRuleToDelete) {
        onDeleteDelegateRuleOrderButtonClick(delegateRuleToDelete, order);
      }

      return;
    }

    const otcOrderToDelete = fullOrders.find((o) => o.nonce === order.id);

    if (otcOrderToDelete) {
      onDeleteOrderButtonClick(otcOrderToDelete, order);
    }
  };

  useEffect(() => {
    if (!activeCancellationId) {
      return;
    }

    setOrders(
      orders.map((order) => ({
        ...order,
        isLoading: order.id === activeCancellationId,
      }))
    );
  }, [activeCancellationId]);

  useEffect(() => {
    if (
      allowances.swapERC20.status === "idle" &&
      allowances.swap.status === "idle"
    ) {
      callGetOrders();
    }
  }, [allowances]);

  return (
    <MyOrdersList
      hasForColumn
      isLoading={isLoading || isAllowancesLoading}
      activeSortType={activeSortType}
      orders={orders}
      sortTypeDirection={sortTypeDirection}
      className={className}
      onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
    />
  );
};

export default MyOtcOrdersList;
