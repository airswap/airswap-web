import { FC, useCallback, useEffect, useState } from "react";

import { FullOrder, FullOrderERC20 } from "@airswap/utils";

import * as ethers from "ethers";

import { useAppSelector } from "../../../../../app/hooks";
import { AppTokenInfo } from "../../../../../entities/AppTokenInfo/AppTokenInfo";
import { isTokenInfo } from "../../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { Allowances } from "../../../../../features/balances/balancesTypes";
import {
  selectAllTokenInfo,
  selectProtocolFee,
} from "../../../../../features/metadata/metadataSlice";
import { OrdersSortType } from "../../../../../types/ordersSortType";
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
  fullOrders: (FullOrder | FullOrderERC20)[];
  sortTypeDirection: Record<OrdersSortType, boolean>;
  library: ethers.providers.BaseProvider;
  onDeleteOrderButtonClick: (order: FullOrder | FullOrderERC20) => void;
  onSortButtonClick: (type: OrdersSortType) => void;
  className?: string;
}

const MyOtcOrdersList: FC<MyOtcOrdersListProps> = ({
  isAllowancesLoading,
  activeCancellationId,
  activeSortType,
  allowances,
  fullOrders,
  library,
  sortTypeDirection,
  onDeleteOrderButtonClick,
  onSortButtonClick,
  className,
}) => {
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeTokens = useAppSelector(selectAllTokenInfo);
  const protocolFee = useAppSelector(selectProtocolFee);
  const callGetOrders = useCallback(async () => {
    const newOrders = await Promise.all(
      fullOrders.map((order) =>
        getFullOrderDataAndTransformToOrder(order, activeTokens, library)
      )
    );

    const erc20OrdersWithApprovalWarnings = getOrdersWithApprovalWarnings(
      newOrders.filter(
        (order) => order.signerToken && isTokenInfo(order.signerToken)
      ),
      allowances.swapERC20.values,
      protocolFee
    );
    const fullOrdersWithApprovalWarnings = getOrdersWithApprovalWarnings(
      newOrders.filter(
        (order) => !order.signerToken || !isTokenInfo(order.signerToken)
      ),
      allowances.swap.values
    );

    const ordersWithApprovalWarnings = [
      ...erc20OrdersWithApprovalWarnings,
      ...fullOrdersWithApprovalWarnings,
    ];

    setOrders(ordersWithApprovalWarnings);
    setIsLoading(false);
  }, [fullOrders, activeTokens]);

  const handleDeleteOrderButtonClick = (order: MyOrder): void => {
    const orderToDelete = fullOrders.find((o) => o.nonce === order.id);

    if (orderToDelete) {
      onDeleteOrderButtonClick(orderToDelete);
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
      onSortButtonClick={onSortButtonClick}
    />
  );
};

export default MyOtcOrdersList;
