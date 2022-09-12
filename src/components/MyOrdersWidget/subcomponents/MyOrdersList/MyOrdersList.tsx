import React, { FC } from "react";

import { FullOrder } from "@airswap/typescript";

import { OrdersSortType } from "../../../../features/myOrders/myOrdersSlice";
import MyOrdersListSortButtons from "../MyOrdersListSortButtons/MyOrdersListSortButtons";
import Order from "../Order/Order";
import { Container, OrdersContainer, Shadow } from "./MyOrdersList.styles";

interface MyOrdersListProps {
  activeSortType: OrdersSortType;
  orders: FullOrder[];
  sortTypeDirection: Record<OrdersSortType, boolean>;
  onSortButtonClick: (type: OrdersSortType) => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  activeSortType,
  orders,
  sortTypeDirection,
  onSortButtonClick,
  className,
}) => {
  return (
    <Container className={className}>
      <MyOrdersListSortButtons
        activeSortType={activeSortType}
        sortTypeDirection={sortTypeDirection}
        onSortButtonClick={onSortButtonClick}
      />
      <OrdersContainer>
        {orders.map((order) => (
          <Order order={order} />
        ))}
      </OrdersContainer>
      <Shadow />
    </Container>
  );
};

export default MyOrdersList;
