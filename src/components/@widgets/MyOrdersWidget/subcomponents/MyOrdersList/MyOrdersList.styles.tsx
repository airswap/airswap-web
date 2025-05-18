import styled from "styled-components/macro";

import { ScrollBarStyle } from "../../../../../style/mixins";
import Tooltip from "../../../../ExpiryIndicator/subcomponents/Tooltip";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import MyOrdersListSortButtons from "../MyOrdersListSortButtons/MyOrdersListSortButtons";

export const Container = styled.div<{ hasOverflow?: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 1.5rem;
  position: relative;

  -webkit-mask-image: ${({ hasOverflow }) =>
    hasOverflow
      ? "-webkit-gradient(linear, 0 75%, 0 100%, from(rgba(0, 0, 0, 1)), to(rgba(0, 0, 0, 0)))"
      : ""};
`;

export const StyledMyOrdersListSortButtons = styled(MyOrdersListSortButtons)<{
  width: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : "100%")};
  padding-left: 2.25rem;
`;

export const OrdersContainer = styled.div`
  ${ScrollBarStyle};

  margin-top: 1rem;
  width: 100%;
  max-height: 20rem;
  padding-left: 1.25rem;
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

export const LoadingSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

export const StyledLoadingSpinner = styled(LoadingSpinner)`
  svg {
    width: 2rem;
    height: 2rem;
  }
`;
