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
  StyledAvailableOrdersListSortButtons,
} from "./AvailableOrdersList.styles";

interface MyOrdersListProps {
  orders?: FullOrderERC20[];
  errorText?: string;

  senderToken: string;
  signerToken: string;
  activeSortType: AvailableOrdersSortType;
  sortTypeDirection: Record<AvailableOrdersSortType, boolean>;
  invertRate: boolean;
  onRateButtonClick: () => void;
  onSortButtonClick: (type: AvailableOrdersSortType) => void;
  onOrderLinkClick: () => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  orders,
  errorText,
  activeSortType,
  sortTypeDirection,
  invertRate,
  onRateButtonClick,
  onSortButtonClick,
  onOrderLinkClick,
  className,
  senderToken,
  signerToken,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth] = useState(0);

  return (
    <Container className={className}>
      <StyledAvailableOrdersListSortButtons
        width={containerWidth}
        activeSortType={activeSortType}
        sortTypeDirection={sortTypeDirection}
        senderTokenSymbol={senderToken}
        signerTokenSymbol={signerToken}
        invertRate={invertRate}
        onSortButtonClick={onSortButtonClick}
        onRateButtonClick={onRateButtonClick}
      />
      {}
      {orders && orders.length >= 1 ? (
        <OrdersContainer ref={containerRef}>
          {orders.map((order, i) => {
            return (
              <Order
                order={order}
                index={i}
                invertRate={invertRate}
                onOrderLinkClick={onOrderLinkClick}
              />
            );
          })}
        </OrdersContainer>
      ) : (
        errorText ?? <LoadingSpinner />
      )}
      <Shadow />
    </Container>
  );
};

export default MyOrdersList;
