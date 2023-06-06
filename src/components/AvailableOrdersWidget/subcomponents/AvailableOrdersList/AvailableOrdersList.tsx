import React, { FC, useRef, useState, useEffect } from "react";

import { FullOrderERC20, OrderERC20 } from "@airswap/types";

import useWindowSize from "../../../../hooks/useWindowSize";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import { AvailableOrdersSortType } from "../../AvailableOrdersWidget";
import Order from "../Order/Order";
import {
  Container,
  OrdersContainer,
  Shadow,
  StyledAvailableOrdersListSortButtons,
  HelperText,
  CutoffTooltip,
} from "./AvailableOrdersList.styles";

interface MyOrdersListProps {
  orders?: (FullOrderERC20 | OrderERC20)[];
  helperText: string | null;
  senderToken: string;
  signerToken: string;
  activeSortType: AvailableOrdersSortType;
  sortTypeDirection: Record<AvailableOrdersSortType, boolean>;
  invertRate: boolean;
  onRateButtonClick: () => void;
  onSortButtonClick: (type: AvailableOrdersSortType) => void;
  onSwapLinkClick: () => void;
  onFullOrderLinkClick?: () => void;
  className?: string;
}

const MyOrdersList: FC<MyOrdersListProps> = ({
  orders = [],
  helperText,
  activeSortType,
  sortTypeDirection,
  invertRate,
  onRateButtonClick,
  onSortButtonClick,
  onSwapLinkClick,
  onFullOrderLinkClick,
  className,
  senderToken,
  signerToken,
}) => {
  const { width: windowWidth } = useWindowSize();

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerScrollTop, setContainerScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState<number | undefined>();
  const [tooltipShift, setTooltipShift] = useState<number | undefined>();
  const [tooltipText, setTooltipText] = useState<string | null>(null);

  const handleMouseEnter = (
    target: HTMLDivElement,
    index: number,
    shift: number
  ) => {
    if (target.offsetWidth < target.scrollWidth) {
      setTooltipIndex(index);
      setTooltipShift(shift);
      setTooltipText(target.textContent);
      setIsTooltipOpen(true);
    }
  };

  const handleMouseLeave = () => isTooltipOpen && setIsTooltipOpen(false);

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
      {orders.length ? (
        <OrdersContainer ref={containerRef}>
          {orders.map((order, i) => {
            return (
              <Order
                key={i}
                order={order}
                index={i}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                invertRate={invertRate}
                onSwapLinkClick={onSwapLinkClick}
                onFullOrderLinkClick={onFullOrderLinkClick}
              />
            );
          })}
          {isTooltipOpen && (
            <CutoffTooltip
              containerScrollTop={containerScrollTop}
              orderIndex={tooltipIndex}
              shift={tooltipShift}
            >
              {tooltipText}
            </CutoffTooltip>
          )}
        </OrdersContainer>
      ) : helperText ? (
        <HelperText>{helperText}</HelperText>
      ) : (
        <LoadingSpinner />
      )}
      <Shadow />
    </Container>
  );
};

export default MyOrdersList;
