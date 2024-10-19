import styled from "styled-components/macro";

import breakPoints, { breakpointSizes } from "../../style/breakpoints";
import { sizes } from "../../style/sizes";
import SocialButtons from "../SocialButtons/SocialButtons";

export const InnerContainer = styled.div<{ $isScrollLocked?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  flex-grow: 1;

  @media ${breakPoints.phoneOnly}, ${breakPoints.shallowScreenOnly} {
    justify-content: flex-start;
    height: auto;
  }

  @media ${breakPoints.phoneOnly} {
    height: 100%;
    padding-bottom: 2rem;
  }
`;

export const StyledPage = styled.div<{ showOverlay?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 18rem;
  min-height: 100vh;
  min-height: 100svh;
  max-height: ${(props) => (props.showOverlay ? "100vh" : "unset")};
  overflow-x: hidden;
  overflow-y: ${(props) => (props.showOverlay ? "hidden" : "unset")};

  @media (min-height: 29rem) and (max-width: ${breakpointSizes.phone}) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 0;
    padding-bottom: 0;
  }

  @media ${breakPoints.phoneOnly} {
    width: 100%;
    padding: 0 ${sizes.pageMobilePadding};
  }
`;

export const StyledSocialButtons = styled(SocialButtons)`
  display: none;

  @media ${breakPoints.tabletPortraitUp} {
    display: flex;
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
  }

  @media ${breakPoints.shallowScreenOnly} {
    justify-content: flex-end;
    position: relative;
    box-sizing: content-box;
    bottom: 0;
    right: 0;
    width: 100%;
    padding-right: 2rem;
    padding-bottom: 1.5rem;
  }
`;
