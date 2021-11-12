import styled from "styled-components/macro";

import convertHexToRGBA from "../../helpers/transformHexToRgba";
import breakPoints from "../../style/breakpoints";
import Icon from "../Icon/Icon";

export const ToolbarContainer = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 7rem;
  height: 100%;
  min-height: 31rem;
  // min-height: 37rem; // for 5 buttons, enable this when stats button is added in toolbar
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

export const IconAirswap = styled(Icon)`
  margin-top: 2rem;
  align-self: center;
  margin-bottom: auto;
`;

export const ToolbarButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 2;
  margin: 2rem 0 4.5rem;
`;
