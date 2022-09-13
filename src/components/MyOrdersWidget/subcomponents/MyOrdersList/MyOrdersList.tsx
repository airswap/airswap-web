import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FullOrder } from "@airswap/typescript";

import { OrdersSortType } from "../../../../features/myOrders/myOrdersSlice";
import MyOrdersListSortButtons from "../MyOrdersListSortButtons/MyOrdersListSortButtons";
import Order from "../Order/Order";
import {
  Container,
  OrdersContainer,
  Shadow,
  StyledTooltip,
} from "./MyOrdersList.styles";

interface MyOrdersListProps {
  activeSortType: OrdersSortType;
  orders: FullOrder[];
  sortTypeDirection: Record<OrdersSortType, boolean>;
  onDeleteOrderButtonClick: (order: FullOrder) => void;
  onSortButtonClick: (type: OrdersSortType) => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  activeSortType,
  orders,
  sortTypeDirection,
  onDeleteOrderButtonClick,
  onSortButtonClick,
  className,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeDeleteButton, setActiveDeleteButton] = useState<number>();
  const [containerScrollTop, setContainerScrollTop] = useState(0);

  const handleDeleteOrderButtonMouseEnter = (index: number) => {
    setActiveDeleteButton(index);
  };

  const handleDeleteOrderButtonMouseLeave = () => {
    setActiveDeleteButton(undefined);
  };

  const handleOnContainerScroll = () => {
    setContainerScrollTop(containerRef.current?.scrollTop || 0);
  };

  useEffect(() => {
    containerRef.current?.addEventListener(
      "scroll",
      handleOnContainerScroll.bind(this)
    );

    return containerRef.current?.removeEventListener(
      "scroll",
      handleOnContainerScroll.bind(this)
    );
  }, [containerRef]);

  return (
    <Container className={className}>
      <MyOrdersListSortButtons
        activeSortType={activeSortType}
        sortTypeDirection={sortTypeDirection}
        onSortButtonClick={onSortButtonClick}
      />
      <OrdersContainer ref={containerRef}>
        {orders.map((order, index) => (
          <Order
            key={order.nonce}
            order={order}
            onDeleteOrderButtonClick={onDeleteOrderButtonClick}
            onDeleteOrderButtonMouseEnter={() =>
              handleDeleteOrderButtonMouseEnter(index)
            }
            onDeleteOrderButtonMouseLeave={handleDeleteOrderButtonMouseLeave}
          />
        ))}
        {activeDeleteButton !== undefined && (
          <StyledTooltip
            activeDeleteButton={activeDeleteButton || 0}
            containerScrollTop={containerScrollTop}
          >
            {t("orders.removeFromList")}
          </StyledTooltip>
        )}
      </OrdersContainer>
      <Shadow />
    </Container>
  );
};

export default MyOrdersList;
