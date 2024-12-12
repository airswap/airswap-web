import styled from "styled-components/macro";

import { ScrollBarStyle } from "../../../../../style/mixins";
import Tooltip from "../../../../ExpiryIndicator/subcomponents/Tooltip";
import MyOrdersListSortButtons from "../MyOrdersListSortButtons/MyOrdersListSortButtons";

export const Container = styled.div<{ hasOverflow: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-block-start: 2rem;
  padding-block-end: ${({ hasOverflow }) => (hasOverflow ? "2rem" : "0")};

  -webkit-mask-image: ${({ hasOverflow }) =>
    hasOverflow
      ? "-webkit-gradient(linear, 0 75%, 0 100%, from(rgba(0, 0, 0, 1)), to(rgba(0, 0, 0, 0)))"
      : ""};
`;

export const StyledMyOrdersListSortButtons = styled(MyOrdersListSortButtons)<{
  width: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
`;

export const OrdersContainer = styled.div`
  ${ScrollBarStyle};

  margin-top: 1rem;
  width: 100%;
  max-height: 20rem;
  padding-right: 1rem;
  overflow-y: auto;
  overflow-x: visible;
`;

export const TooltipContainer = styled.div`
  position: relative;
`;

export const StyledTooltip = styled(Tooltip)<{
  orderIndex: number;
  containerScrollTop: number;
}>`
  justify-content: flex-start;
  position: absolute;
  left: unset;
  right: 3rem;
  top: calc(
    2.25rem + ${({ containerScrollTop }) => -containerScrollTop}px + 3rem *
      ${({ orderIndex }) => orderIndex}
  );
  width: auto;
  z-index: 3;
  pointer-events: none;
`;

export const DeleteButtonTooltip = styled(StyledTooltip)`
  margin-left: -1rem;
`;

export const OrderIndicatorTooltip = styled(StyledTooltip)`
  justify-content: flex-end;
  margin-left: 0.5rem;
  width: 0;
`;
