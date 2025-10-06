import styled from "styled-components/macro";

import breakPoints from "../../../../../style/breakpoints";
import SortButton from "../../../../SortButton/SortButton";

export const Container = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
`;

export const PairButtonWrapper = styled.div`
  margin-left: -0.25rem;
  overflow: hidden;
`;

export const ActionsButton = styled(SortButton)`
  @media ${breakPoints.phoneOnly} {
    display: none;
  }
`;
