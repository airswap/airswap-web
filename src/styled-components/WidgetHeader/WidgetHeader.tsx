import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";

export const WidgetHeader = styled.div`
  display: flex;
  justify-content: center;
  min-height: 2rem;
  width: 100%;

  @media ${breakPoints.phoneOnly} {
    // margin-bottom: 1rem;
  }
`;
