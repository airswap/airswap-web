import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useIsOverflowing from "../../../../../hooks/useIsOverflowing";
import useWindowSize from "../../../../../hooks/useWindowSize";
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
  StyledMyOrdersListSortButtons,
  LoadingSpinnerContainer,
  StyledFadedScrollContainer,
} from "./MyOrdersList.styles";
import { getSortedOrders } from "./helpers";

interface MyOrdersListProps {
  hasFilledColumn?: boolean;
  hasForColumn?: boolean;
  isLoading: boolean;
  activeSortType: OrdersSortType;
  orders: MyOrder[];
  sortTypeDirection: Record<OrdersSortType, boolean>;
  onDeleteOrderButtonClick: (order: MyOrder) => void;
  onSortButtonClick: (type: OrdersSortType) => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  hasFilledColumn,
  hasForColumn,
  isLoading,
  activeSortType,
  orders,
  sortTypeDirection,
  onDeleteOrderButtonClick,
  onSortButtonClick,
  className,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleDeleteOrderButtonMouseEnter = (
    index: number,
    orderIsOpen: boolean
  ) => {
    setActiveDeleteButtonTooltipIndex(index);
    const tooltipText = orderIsOpen
      ? t("orders.cancelOrder")
      : t("orders.dismiss");
    setTooltipText(tooltipText);
  };

  const handleDeleteOrderButtonMouseLeave = () => {
    setActiveDeleteButtonTooltipIndex(undefined);
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

  if (isLoading) {
    return (
      <Container className={className}>
        <StyledMyOrdersListSortButtons
          activeSortType={activeSortType}
          hasFilledColumn={hasFilledColumn}
          hasForColumn={hasForColumn}
          sortTypeDirection={sortTypeDirection}
          onSortButtonClick={onSortButtonClick}
        />
        <LoadingSpinnerContainer>
          <StyledLoadingSpinner />
        </LoadingSpinnerContainer>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <StyledMyOrdersListSortButtons
        hasFilledColumn={hasFilledColumn}
        hasForColumn={hasForColumn}
        activeSortType={activeSortType}
        sortTypeDirection={sortTypeDirection}
        onSortButtonClick={onSortButtonClick}
      />
      <StyledFadedScrollContainer resizeDependencies={[sortedOrders]}>
        <OrdersContainer ref={containerRef}>
          {sortedOrders.map((order, index) => (
            <Order
              key={order.id}
              hasFilledColumn={hasFilledColumn}
              hasForColumn={hasForColumn}
              order={order}
              index={index}
              onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
              onDeleteOrderButtonMouseEnter={handleDeleteOrderButtonMouseEnter}
              onDeleteOrderButtonMouseLeave={handleDeleteOrderButtonMouseLeave}
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
      </StyledFadedScrollContainer>
    </Container>
  );
};

export default MyOrdersList;
