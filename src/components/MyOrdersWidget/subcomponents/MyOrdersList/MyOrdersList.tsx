import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FullOrder } from "@airswap/typescript";

import { OrdersSortType } from "../../../../features/myOrders/myOrdersSlice";
import useWindowSize from "../../../../hooks/useWindowSize";
import Order from "../Order/Order";
import {
  Container,
  OrdersContainer,
  Shadow,
  StyledMyOrdersListSortButtons,
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
  const { width: windowWidth } = useWindowSize();

  const [activeDeleteButton, setActiveDeleteButton] = useState<number>();
  const [containerScrollTop, setContainerScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

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

  useEffect(() => {
    setContainerWidth(containerRef.current?.scrollWidth || 0);
  }, [containerRef, windowWidth]);

  return (
    <Container className={className}>
      <StyledMyOrdersListSortButtons
        width={containerWidth}
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
