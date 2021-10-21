import styled from "styled-components/macro";

import breakPoints from "../../style/breakpoints";
import Icon from "../Icon/Icon";

export const ToolbarContainer = styled.div`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 7rem;
  height: 100%;
  min-height: 100vh;
  padding: 2rem 1rem 0;
  border-right: 1px solid ${(props) => props.theme.colors.borderGrey};
  overflow: hidden;
  background: ${(props) => props.theme.colors.black};
  z-index: 1;

  @media ${breakPoints.tabletPortraitUp} {
    // TODO: Show toolbar when content for modals are designed

    display: none;
    // display: flex;
  }
`;

export const IconAirswap = styled(Icon)`
  align-self: center;
  margin-bottom: auto;
`;

export const ToolbarButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 2;
  margin: 2rem 0;
`;
