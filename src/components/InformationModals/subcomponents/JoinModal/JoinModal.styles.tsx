import styled from "styled-components/macro";

import breakPoints from "../../../../style/breakpoints";

export const GuideButtons = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  margin-top: 2.125rem;

  @media ${breakPoints.phoneOnly} {
    flex-wrap: wrap;
  }
`;
