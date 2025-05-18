import styled from "styled-components/macro";

import breakpoints from "../../../../../style/breakpoints";
import SortButton from "../../../../SortButton/SortButton";
import { MyOrdersGrid } from "../../../MyOrdersWidget/MyOrdersWidget.styles";

export const Container = styled.div`
  ${MyOrdersGrid}

  padding-right: 1rem;
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
