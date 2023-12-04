import breakPoints from "../../style/breakpoints";
import styled from "styled-components/macro";

export const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 2rem;
  margin-bottom: 1.875rem;
  width: 100%;

  @media ${breakPoints.phoneOnly} {
    margin-bottom: 1rem;
  }
`;
