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

  @media ${breakPoints.phoneOnly}, ${breakPoints.shallowScreenOnly} {
    justify-content: flex-start;
    height: auto;
  }

  @media ${breakPoints.phoneOnly} {
    height: 100%;
    padding-bottom: 2rem;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: ${(props) =>
      props.theme.name === "dark"
        ? "conic-gradient(from 180deg at -10% -10%, #060607 -7.2deg, #2B71FF 37.8deg, #060607 352.8deg, #2B71FF 397.8deg)"
        : props.theme.colors.primary};
    transform: rotate(0.5turn) scaleX(-1);
  }
`;

export const StyledPage = styled.div`
  position: relative;
  min-width: 18rem;
  height: 100vh;
  min-height: 34.5rem;

  @media (min-height: 29rem) and (max-width: ${breakpointSizes.phone}) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    padding-top: 0;
    padding-bottom: 0;
  }

  @media ${breakPoints.phoneOnly} {
    width: 100%;
    height: 100vh;
    min-height: ${sizes.widgetMobileSize};
    padding: 0 ${sizes.pageMobilePadding};
  }
`;

export const StyledSocialButtons = styled(SocialButtons)`
  display: none;

  @media ${breakPoints.tabletPortraitUp} {
    display: flex;
    position: absolute;
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

export const BlurredOverlay = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  backdrop-filter: blur(20px);
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transition: opacity 0.3s ease-out;
  filter: brightness(0.5);
  pointer-events: ${(props) => (props.isVisible ? "visible" : "none")};
`;
