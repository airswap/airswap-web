import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { atom, useSetAtom } from "jotai";

import { OrderStatus } from "../../../../../types/orderStatus";
import { OrdersSortType } from "../../../../../types/ordersSortType";
import { MyOrder } from "../../../MyOrdersWidget/entities/MyOrder";
import { getOrderStatusTranslation } from "../../../MyOrdersWidget/helpers";
import Order from "../Order/Order";
import {
  Container,
  DeleteButtonTooltip,
  OrderIndicatorTooltip,
  OrdersContainer,
  StyledLoadingSpinner,
  LoadingSpinnerContainer,
} from "./MyOrdersList.styles";
import { getSortedOrders } from "./helpers";

export const myOrdersListLoadingAtom = atom(false);

interface MyOrdersListProps {
  hasFilledColumn?: boolean;
  hasForColumn?: boolean;
  isLoading: boolean;
  activeSortType: OrdersSortType;
  orders: MyOrder[];
  sortTypeDirection: Record<OrdersSortType, boolean>;
  onDeleteOrderButtonClick: (order: MyOrder) => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  isLoading,
  activeSortType,
  orders,
  sortTypeDirection,
  onDeleteOrderButtonClick,
  className,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const setMyOrdersListLoading = useSetAtom(myOrdersListLoadingAtom);

  const [activeDeleteButtonTooltipIndex, setActiveDeleteButtonTooltipIndex] =
    useState<number>();
  const [
    activeOrderIndicatorTooltipIndex,
    setActiveOrderIndicatorTooltipIndex,
  ] = useState<number>();
  const [tooltipText, setTooltipText] = useState("");
  const [containerScrollTop, setContainerScrollTop] = useState(0);

  const sortedOrders = useMemo(() => {
    return getSortedOrders(
      orders,
      activeSortType,
      sortTypeDirection[activeSortType]
    );
  }, [orders, activeSortType, sortTypeDirection]);

  const handleDeleteOrderButtonClick = (order: MyOrder) => {
    setActiveDeleteButtonTooltipIndex(undefined);
    onDeleteOrderButtonClick(order);
  };

  const handleStatusIndicatorMouseEnter = (
    index: number,
    status: OrderStatus
  ) => {
    setTooltipText(getOrderStatusTranslation(status));
    setActiveOrderIndicatorTooltipIndex(index);
  };

  const handleStatusIndicatorMouseLeave = () => {
    setActiveOrderIndicatorTooltipIndex(undefined);
  };

  const handleOnContainerScroll = () => {
    setContainerScrollTop(containerRef.current?.scrollTop || 0);
  };

  useEffect(() => {
    containerRef.current?.addEventListener(
      "scroll",
      handleOnContainerScroll.bind(this)
    );

    return () => {
      containerRef.current?.removeEventListener(
        "scroll",
        handleOnContainerScroll.bind(this)
      );
    };
  }, [containerRef]);

  useEffect(() => {
    setMyOrdersListLoading(isLoading);
  }, [isLoading]);

  if (isLoading) {
    return (
      <Container className={className}>
        <LoadingSpinnerContainer>
          <StyledLoadingSpinner />
        </LoadingSpinnerContainer>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <OrdersContainer ref={containerRef}>
        {sortedOrders.map((order, index) => (
          <Order
            key={order.id}
            order={order}
            index={index}
            onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
            onStatusIndicatorMouseEnter={handleStatusIndicatorMouseEnter}
            onStatusIndicatorMouseLeave={handleStatusIndicatorMouseLeave}
            isCancelInProgress={false}
          />
        ))}
        {activeDeleteButtonTooltipIndex !== undefined && (
          <DeleteButtonTooltip
            orderIndex={activeDeleteButtonTooltipIndex || 0}
            containerScrollTop={containerScrollTop}
          >
            {tooltipText}
          </DeleteButtonTooltip>
        )}
        {activeOrderIndicatorTooltipIndex !== undefined && (
          <OrderIndicatorTooltip
            orderIndex={activeOrderIndicatorTooltipIndex || 0}
            containerScrollTop={containerScrollTop}
          >
            {tooltipText}
          </OrderIndicatorTooltip>
        )}
      </OrdersContainer>
    </Container>
  );
};

export default MyOrdersList;
