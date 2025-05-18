import { FC, useCallback, useEffect, useState } from "react";

import { FullOrder, FullOrderERC20 } from "@airswap/utils";

import * as ethers from "ethers";

import { useAppSelector } from "../../../../../app/hooks";
import { AppTokenInfo } from "../../../../../entities/AppTokenInfo/AppTokenInfo";
import { selectAllTokenInfo } from "../../../../../features/metadata/metadataSlice";
import { OrdersSortType } from "../../../../../types/ordersSortType";
import { MyOrder } from "../../../MyOrdersWidget/entities/MyOrder";
import MyOrdersList from "../../../MyOrdersWidget/subcomponents/MyOrdersList/MyOrdersList";
import { getFullOrderDataAndTransformToOrder } from "./helpers";

interface MyOtcOrdersListProps {
  activeCancellationId?: string;
  activeSortType: OrdersSortType;
  activeTokens: AppTokenInfo[];
  fullOrders: (FullOrder | FullOrderERC20)[];
  sortTypeDirection: Record<OrdersSortType, boolean>;
  library: ethers.providers.BaseProvider;
  onDeleteOrderButtonClick: (order: FullOrder | FullOrderERC20) => void;
  onSortButtonClick: (type: OrdersSortType) => void;
  className?: string;
}

const MyOtcOrdersList: FC<MyOtcOrdersListProps> = ({
  activeCancellationId,
  activeSortType,
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

  const callGetOrders = useCallback(async () => {
    const newOrders = await Promise.all(
      fullOrders.map((order) =>
        getFullOrderDataAndTransformToOrder(order, activeTokens, library)
      )
    );

    setOrders(newOrders);
    setIsLoading(false);
  }, [fullOrders, activeTokens, activeCancellationId]);

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
    callGetOrders();
  }, []);

  return (
    <MyOrdersList
      hasForColumn
      isLoading={isLoading}
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
