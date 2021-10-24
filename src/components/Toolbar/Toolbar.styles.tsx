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
  padding: 2rem 1rem;
  border-right: 1px solid ${(props) => props.theme.colors.borderGrey};
  overflow: hidden;
  background: ${(props) => props.theme.colors.black};
  z-index: 1;

  @media ${breakPoints.tabletPortraitUp} {
    display: flex;
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
  margin-top: 1rem;
`;
