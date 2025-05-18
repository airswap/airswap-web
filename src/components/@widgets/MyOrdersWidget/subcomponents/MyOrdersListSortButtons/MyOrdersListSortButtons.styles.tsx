import styled from "styled-components/macro";

import breakpoints from "../../../../../style/breakpoints";
import SortButton from "../../../../SortButton/SortButton";
import {
  MyLimitOrderGrid,
  MyOrdersGrid,
} from "../../../MyOrdersWidget/MyOrdersWidget.styles";

export const Container = styled.div<{
  hasOverflow: boolean;
  hasFilledColumn?: boolean;
}>`
  ${({ hasFilledColumn }) =>
    hasFilledColumn ? MyLimitOrderGrid : MyOrdersGrid};

  padding-right: ${({ hasOverflow }) => (hasOverflow ? "2.5rem" : "2rem")};
`;

export const PairButtonWrapper = styled.div`
  margin-left: -0.25rem;
  overflow: hidden;
`;

export const ActionsButton = styled(SortButton)`
  display: none;

  @media ${breakpoints.tabletPortraitUp} {
    display: flex;
  }
`;
