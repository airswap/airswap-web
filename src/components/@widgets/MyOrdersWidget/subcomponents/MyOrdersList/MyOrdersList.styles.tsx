import styled from "styled-components/macro";

import Tooltip from "../../../../ExpiryIndicator/subcomponents/Tooltip";
import { FadedScrollContainer } from "../../../../FadedScrollContainer/FadedScrollContainer";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import MyOrdersListSortButtons from "../MyOrdersListSortButtons/MyOrdersListSortButtons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
  width: 100%;
  height: 100%;
  padding-left: 1.375rem;
  padding-right: 0.5rem;
`;

export const StyledMyOrdersListSortButtons = styled(MyOrdersListSortButtons)``;

export const StyledFadedScrollContainer = styled(FadedScrollContainer)`
  margin-block-start: 0;
  margin-inline-start: -2.25rem;
  height: 100%;
  max-height: inherit;
  padding-block: 0;
  padding-inline-start: 2.25rem;
`;

export const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div:last-child {
    margin-bottom: 2rem;
  }
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
  right: 4rem;
  top: calc(
    0.5rem + ${({ containerScrollTop }) => -containerScrollTop}px + 3rem *
      ${({ orderIndex }) => orderIndex}
  );
  width: auto;
  height: 2rem;
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
  grid-column: 1 / -1;
  width: 100%;
  height: 10rem;
`;

export const StyledLoadingSpinner = styled(LoadingSpinner)`
  svg {
    width: 2rem;
    height: 2rem;
  }
`;
