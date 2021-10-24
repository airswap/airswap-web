import styled from "styled-components/macro";

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
  border-right: 1px solid ${(props) => props.theme.colors.borderGrey};
  overflow: hidden;
  background: ${(props) => props.theme.colors.black};
  z-index: 1;

  @media ${breakPoints.tabletPortraitUp} {
    // TODO: Show toolbar when modals PR is implemented

    display: none;
    // display: flex;
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
