import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import useWindowSize from "../../../../hooks/useWindowSize";
import { OrderStatus } from "../../../../types/orderStatus";
import { AvailableOrdersSortType } from "../../AvailableOrdersWidget";
import Order from "../Order/Order";
import {
  Container,
  OrdersContainer,
  Shadow,
  StyledMyOrdersListSortButtons,
} from "./AvailableOrdersList.styles";

interface MyOrdersListProps {
  activeSortType: AvailableOrdersSortType;
  sortTypeDirection: Record<AvailableOrdersSortType, boolean>;
  onSortButtonClick: (type: AvailableOrdersSortType) => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  activeSortType,
  sortTypeDirection,
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

  const handleDeleteOrderButtonMouseEnter = (
    index: number,
    orderIsOpen: boolean
  ) => {
    setActiveDeleteButtonTooltipIndex(index);
    const tooltipText = orderIsOpen
      ? t("orders.cancelSwap")
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
    <Container className={className}>
      <StyledMyOrdersListSortButtons
        width={containerWidth}
        activeSortType={activeSortType}
        sortTypeDirection={sortTypeDirection}
        onSortButtonClick={onSortButtonClick}
      />
      <OrdersContainer ref={containerRef}></OrdersContainer>
      <Shadow />
    </Container>
  );
};

export default MyOrdersList;
