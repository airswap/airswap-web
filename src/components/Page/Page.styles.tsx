import styled from "styled-components/macro";

import SiteLogo from "../SiteLogo/SiteLogo";

export const StyledSiteLogo = styled(SiteLogo)`
  position: absolute;
  top: 2.5rem;
  left: 2.5rem;
`;

export const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 18rem;
  min-height: 100vh;
  padding: 2rem 0;

  @media (min-height: 50rem) {
    align-items: center;
    height: 100vh;
    min-height: 50rem;
  }
`;
