import React, { FC, useRef, useState, useEffect } from "react";

import { FullOrderERC20 } from "@airswap/types";

import useWindowSize from "../../../../hooks/useWindowSize";
import LoadingSpinner from "../../../LoadingSpinner/LoadingSpinner";
import { AvailableOrdersSortType } from "../../AvailableOrdersWidget";
import Order from "../Order/Order";
import {
  Container,
  OrdersContainer,
  Shadow,
  StyledAvailableOrdersListSortButtons,
  Error,
  CutoffTooltip,
} from "./AvailableOrdersList.styles";

interface MyOrdersListProps {
  orders?: FullOrderERC20[];
  helperText: string | null;
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
  helperText,
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
      {orders && orders.length >= 1 ? (
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
                onOrderLinkClick={onOrderLinkClick}
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
        <Error>{helperText}</Error>
      ) : (
        <LoadingSpinner />
      )}
      <Shadow />
    </Container>
  );
};

export default MyOrdersList;
