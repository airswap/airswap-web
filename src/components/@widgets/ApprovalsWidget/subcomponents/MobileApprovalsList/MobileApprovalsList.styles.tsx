import styled from "styled-components/macro";

import breakPoints from "../../../../../style/breakpoints";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1 / -1;
  gap: 2.5rem;
  width: 100%;

  @media ${breakPoints.tabletLandscapeUp} {
    display: none;
  }
`;
