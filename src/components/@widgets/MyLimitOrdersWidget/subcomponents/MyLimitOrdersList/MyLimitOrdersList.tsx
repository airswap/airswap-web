import { FC, useCallback, useEffect, useState } from "react";

import { TokenInfo } from "@airswap/utils";

import * as ethers from "ethers";

import { useAppSelector } from "../../../../../app/hooks";
import { isTokenInfo } from "../../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { DelegateRule } from "../../../../../entities/DelegateRule/DelegateRule";
import { Allowances } from "../../../../../features/balances/balancesTypes";
import { selectAllTokenInfo } from "../../../../../features/metadata/metadataSlice";
import { OrdersSortType } from "../../../../../types/ordersSortType";
import { MyOrder } from "../../../MyOrdersWidget/entities/MyOrder";
import { getOrdersWithApprovalWarnings } from "../../../MyOrdersWidget/helpers";
import { StyledMyLimitOrdersList } from "./MyLimitOrdersList.styles";
import { getDelegateRuleDataAndTransformToMyOrder } from "./helpers";

interface MyLimitOrdersListProps {
  isAllowancesLoading: boolean;
  activeCancellationId?: string;
  activeSortType: OrdersSortType;
  activeTokens: TokenInfo[];
  allowances: Allowances;
  delegateRules: DelegateRule[];
  sortTypeDirection: Record<OrdersSortType, boolean>;
  library: ethers.providers.BaseProvider;
  onDeleteOrderButtonClick: (order: DelegateRule, myOrder: MyOrder) => void;
  onSortButtonClick: (type: OrdersSortType) => void;
  className?: string;
}

const MyLimitOrdersList: FC<MyLimitOrdersListProps> = ({
  isAllowancesLoading,
  activeCancellationId,
  activeSortType,
  allowances,
  delegateRules,
  library,
  sortTypeDirection,
  onDeleteOrderButtonClick,
  onSortButtonClick,
  className,
}) => {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeTokens = useAppSelector(selectAllTokenInfo);

  const callGetOrders = useCallback(async () => {
    const newOrders = await Promise.all(
      delegateRules.map((order) =>
        getDelegateRuleDataAndTransformToMyOrder(order, activeTokens, library)
      )
    );

    const ordersWithApprovalWarnings = getOrdersWithApprovalWarnings(
      newOrders.filter((order) => order.senderToken),
      allowances.delegate.values
    );

    setOrders(ordersWithApprovalWarnings);
    setIsLoading(false);
  }, [delegateRules, activeTokens, activeCancellationId]);

  const handleDeleteOrderButtonClick = (order: MyOrder): void => {
    const orderToDelete = delegateRules.find((o) => o.id === order.id);

    if (orderToDelete) {
      onDeleteOrderButtonClick(orderToDelete, order);
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
  }, [delegateRules]);

  return (
    <StyledMyLimitOrdersList
      hasFilledColumn
      isLoading={isLoading || isAllowancesLoading}
      activeSortType={activeSortType}
      orders={orders}
      sortTypeDirection={sortTypeDirection}
      className={className}
      onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
      onSortButtonClick={onSortButtonClick}
    />
  );
};

export default MyLimitOrdersList;
