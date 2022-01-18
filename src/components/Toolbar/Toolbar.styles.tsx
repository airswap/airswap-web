import styled from "styled-components/macro";

import convertHexToRGBA from "../../helpers/transformHexToRgba";
import breakPoints from "../../style/breakpoints";
import { ScrollBarStyle } from "../../style/mixins";
import { sizes } from "../../style/sizes";
import { AirswapButton } from "../../styled-components/AirswapButton/AirswapButton";

export const ToolbarContainer = styled.div<{
  $isHiddenOnMobile?: boolean;
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
  height: 100vh;
  z-index: 5;
  background: ${({ theme }) => convertHexToRGBA(theme.colors.black, 0.75)};

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
  overflow-y: ${({ $overflow }) => ($overflow ? "scroll" : "hidden")};
  background: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.black : theme.colors.primary};

  @media (min-height: ${sizes.toolbarMaxHeight}) and (${breakPoints.tabletPortraitUp}) {
    margin: 2rem 0 4.5rem;
  }

  @media ${breakPoints.tabletPortraitUp} {
    width: auto;
    padding: 0;
    overflow-y: auto;
    justify-content: center;
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
