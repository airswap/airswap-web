import React, { FC } from "react";

import { FullOrder } from "@airswap/typescript";

import { OrdersSortType } from "../../../../features/myOrders/myOrdersSlice";
import MyOrdersListSortButtons from "../MyOrdersListSortButtons/MyOrdersListSortButtons";
import { Container } from "./MyOrdersList.styles";

interface MyOrdersListProps {
  orders: FullOrder[];
  activeSortType: OrdersSortType;
  sortTypeDirection: Record<OrdersSortType, boolean>;
  onSortButtonClick: (type: OrdersSortType) => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  activeSortType,
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
    </Container>
  );
};

export default MyOrdersList;
