import styled from "styled-components/macro";
import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";
import SiteLogo from "../SiteLogo/SiteLogo";

export const StyledSiteLogo = styled(SiteLogo)`
  position: absolute;
  top: 3.75rem;
  left: 3.125rem;
`;

export const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  min-height: 100vh;
  padding: 2rem 0;

  @media ${breakPoints.tabletLandscapeUp} {
    padding-right: ${sizes.sideBarWidth};
  }

  @media (min-height: 50rem) {
    align-items: center;
    height: 100vh;
    min-height: 50rem;
  }
`;
