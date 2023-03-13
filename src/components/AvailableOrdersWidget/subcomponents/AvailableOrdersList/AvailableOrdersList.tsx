import React, { FC, useRef, useState } from "react";

import { IndexedOrderResponse } from "@airswap/libraries";
import { FullOrderERC20 } from "@airswap/types";

import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import { AvailableOrdersSortType } from "../../AvailableOrdersWidget";
import Order from "../Order/Order";
import {
  Container,
  OrdersContainer,
  Shadow,
  StyledMyOrdersListSortButtons,
} from "./AvailableOrdersList.styles";

interface MyOrdersListProps {
  orders?: Record<string, IndexedOrderResponse>;
  senderToken: string;
  signerToken: string;
  activeSortType: AvailableOrdersSortType;
  sortTypeDirection: Record<AvailableOrdersSortType, boolean>;
  onSortButtonClick: (type: AvailableOrdersSortType) => void;
  onOrderLinkClick: () => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  orders,
  activeSortType,
  sortTypeDirection,
  onSortButtonClick,
  onOrderLinkClick,
  className,
  senderToken,
  signerToken,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [invertRate, setInvertRate] = useState(false);
  const [containerWidth] = useState(0);

  const handleRateButtonClick = () => {
    setInvertRate(!invertRate);
  };

  return (
    <Container className={className}>
      <StyledMyOrdersListSortButtons
        width={containerWidth}
        activeSortType={activeSortType}
        sortTypeDirection={sortTypeDirection}
        senderTokenSymbol={senderToken}
        signerTokenSymbol={signerToken}
        invertRate={invertRate}
        onSortButtonClick={onSortButtonClick}
        onRateButtonClick={handleRateButtonClick}
      />
      {orders && Object.entries(orders).length >= 1 ? (
        <OrdersContainer ref={containerRef}>
          {Object.entries(orders).map(([, order], i) => {
            return (
              <Order
                order={order.order}
                index={i}
                onOrderLinkClick={onOrderLinkClick}
              />
            );
          })}
        </OrdersContainer>
      ) : (
        <LoadingSpinner />
      )}
      <Shadow />
    </Container>
  );
};

export default MyOrdersList;
