import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FullOrderERC20 } from "@airswap/utils";

import { OrdersSortType } from "../../../../../features/myOrders/myOrdersSlice";
import useIsOverflowing from "../../../../../hooks/useIsOverflowing";
import useWindowSize from "../../../../../hooks/useWindowSize";
import { OrderStatus } from "../../../../../types/orderStatus";
import { getOrderStatusTranslation } from "../../helpers";
import Order from "../Order/Order";
import {
  Container,
  DeleteButtonTooltip,
  OrderIndicatorTooltip,
  OrdersContainer,
  StyledMyOrdersListSortButtons,
} from "./MyOrdersList.styles";

interface MyOrdersListProps {
  activeSortType: OrdersSortType;
  orders: FullOrderERC20[];
  sortTypeDirection: Record<OrdersSortType, boolean>;
  onDeleteOrderButtonClick: (order: FullOrderERC20) => void;
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

  const [activeDeleteButtonTooltipIndex, setActiveDeleteButtonTooltipIndex] =
    useState<number>();
  const [
    activeOrderIndicatorTooltipIndex,
    setActiveOrderIndicatorTooltipIndex,
  ] = useState<number>();
  const [tooltipText, setTooltipText] = useState("");
  const [containerScrollTop, setContainerScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const [, hasOverflow] = useIsOverflowing(containerRef);

  const handleDeleteOrderButtonClick = (order: FullOrderERC20) => {
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

    return containerRef.current?.removeEventListener(
      "scroll",
      handleOnContainerScroll.bind(this)
    );
  }, [containerRef]);

  useEffect(() => {
    setContainerWidth(containerRef.current?.scrollWidth || 0);
  }, [containerRef, windowWidth]);

  return (
    <Container className={className} hasOverflow={hasOverflow}>
      <StyledMyOrdersListSortButtons
        width={containerWidth}
        activeSortType={activeSortType}
        hasOverflow={hasOverflow}
        sortTypeDirection={sortTypeDirection}
        onSortButtonClick={onSortButtonClick}
      />
      <OrdersContainer ref={containerRef}>
        {orders.map((order, index) => (
          <Order
            key={order.nonce}
            order={order}
            index={index}
            onDeleteOrderButtonClick={handleDeleteOrderButtonClick}
            onDeleteOrderButtonMouseEnter={handleDeleteOrderButtonMouseEnter}
            onDeleteOrderButtonMouseLeave={handleDeleteOrderButtonMouseLeave}
            onStatusIndicatorMouseEnter={handleStatusIndicatorMouseEnter}
            onStatusIndicatorMouseLeave={handleStatusIndicatorMouseLeave}
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
