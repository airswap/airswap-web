import styled from "styled-components/macro";

import breakpoints from "../../../../../style/breakpoints";
import Tooltip from "../../../../ExpiryIndicator/subcomponents/Tooltip";
import { FadedScrollContainer } from "../../../../FadedScrollContainer/FadedScrollContainer";
import LoadingSpinner from "../../../../LoadingSpinner/LoadingSpinner";
import MyOrdersListSortButtons from "../MyOrdersListSortButtons/MyOrdersListSortButtons";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1rem 3rem 3fr 6fr 6fr 3fr 4rem;
  grid-column-gap: 1rem;
  width: 100%;
  padding-left: 2rem;
`;

export const StyledMyOrdersListSortButtons = styled(MyOrdersListSortButtons)``;

export const StyledFadedScrollContainer = styled(FadedScrollContainer)`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  align-items: flex-start;
  margin-top: 1rem;
  min-height: 15rem;
  max-height: 20rem;
  margin-inline-start: -2.5rem;
  padding-inline-start: 2.5rem;
`;

export const OrdersContainer = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
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
