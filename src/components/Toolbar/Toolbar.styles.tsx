import styled from "styled-components/macro";

import convertHexToRGBA from "../../helpers/transformHexToRgba";
import breakPoints from "../../style/breakpoints";
import { BorderlessButtonStyleType2 } from "../../style/mixins";
import { sizes } from "../../style/sizes";
import IconButton from "../IconButton/IconButton";

export const ToolbarContainer = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
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
  z-index: 1;

  @media ${breakPoints.tabletPortraitUp} {
    display: flex;
  }
`;

export const AirswapButton = styled(IconButton)`
  ${BorderlessButtonStyleType2};

  margin-top: 1rem;
  align-self: center;
  margin-bottom: auto;

  @media (min-height: ${sizes.toolbarMaxHeight}) {
    margin-top: 2rem;
  }
`;

export const ToolbarButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 2;
  margin: 0;

  @media (min-height: ${sizes.toolbarMaxHeight}) {
    margin: 2rem 0 4.5rem;
  }
`;
