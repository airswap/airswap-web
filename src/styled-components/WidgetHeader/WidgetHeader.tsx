import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";

export const WidgetHeader = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  min-height: 2rem;
  width: 100%;

  @media ${breakPoints.phoneOnly} {
    // margin-bottom: 1rem;
  }
`;
