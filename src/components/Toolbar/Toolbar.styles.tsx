import styled from "styled-components/macro";

import convertHexToRGBA from "../../helpers/transformHexToRgba";
import breakPoints from "../../style/breakpoints";
import { ScrollBarStyle } from "../../style/mixins";
import { sizes } from "../../style/sizes";
import { AirswapButton } from "../../styled-components/AirswapButton/AirswapButton";
import SocialButtons from "../SocialButtons/SocialButtons";

export const ToolbarContainer = styled.div<{
  $isHiddenOnMobile?: boolean;
  $overflow?: boolean;
}>`
  transform: translateX(
    ${({ $isHiddenOnMobile }) => ($isHiddenOnMobile ? "0" : "-100%")}
  );
  transition: transform 0.5s cubic-bezier(0.57, 0.01, 0.3, 1);

  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: ${({ theme, $overflow }) =>
    theme.name === "dark"
      ? convertHexToRGBA(theme.colors.black, $overflow ? 1 : 0.8)
      : convertHexToRGBA(theme.colors.primary, $overflow ? 1 : 0.9)};
  backdrop-filter: blur(2px);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.tabletPortraitUp} {
    transform: none;
    transition: none;

    align-items: center;
    position: absolute;
    left: 0;
    width: 7rem;
    height: 100%;
    padding: 0 1rem 0;
    border-right: 1px solid
      ${({ theme }) =>
        theme.name === "dark"
          ? theme.colors.borderGrey
          : convertHexToRGBA(theme.colors.borderGrey, 0.2)};
    overflow: hidden;
    background: ${(props) =>
      props.theme.name === "dark"
        ? props.theme.colors.black
        : props.theme.colors.primary};
    z-index: 3;
    backdrop-filter: none;
  }
`;

export const ToolbarButtonsContainer = styled.div<{ $overflow?: boolean }>`
  ${ScrollBarStyle};

  display: flex;
  flex-direction: column;
  flex-grow: 2;
  margin: 0;
  width: ${({ $overflow }) => ($overflow ? "calc(100% - 1rem)" : "100%")};
  padding-right: ${({ $overflow }) => ($overflow ? "1rem" : "0")};
  padding-bottom: 2rem;
  overflow-x: hidden;
  overflow-y: ${({ $overflow }) => ($overflow ? "scroll" : "hidden")};

  @media (min-height: ${sizes.toolbarMaxHeight}) and (${breakPoints.tabletPortraitUp}) {
    margin: 2rem 0 4.5rem;
  }

  @media ${breakPoints.tabletPortraitUp} {
    justify-content: center;
    width: auto;
    overflow-y: auto;
  }
`;

export const StyledAirswapButton = styled(AirswapButton)`
  display: none;

  @media (min-height: ${sizes.toolbarMaxHeight}) {
    margin-top: 2rem;
  }

  @media ${breakPoints.tabletPortraitUp} {
    display: flex;
    align-self: center;
    margin-top: 2rem;
  }
`;

export const StyledSocialButtons = styled(SocialButtons)`
  justify-content: center;
  justify-self: flex-end;
  box-sizing: content-box;
  margin-top: auto;
  width: 100%;
  padding-top: 2rem;
  gap: 1.5rem;

  @media ${breakPoints.tabletPortraitUp} {
    display: none;
  }
`;
