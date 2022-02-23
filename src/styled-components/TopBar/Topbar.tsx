import styled from "styled-components/macro";

import IconButton from "../../components/IconButton/IconButton";
import { IconButtonStyle } from "../../components/IconButton/IconButton.styles";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import breakPoints from "../../style/breakpoints";
import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";
import { AirswapButton } from "../AirswapButton/AirswapButton";

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row-reverse;
  position: absolute;
  box-sizing: content-box;
  top: 0;
  right: 0;
  width: calc(100% - 3rem);
  height: 3rem;
  padding: 1.5rem;
  z-index: 1;

  @media ${breakPoints.tabletPortraitUp} {
    flex-direction: row;
    width: auto;
    padding: 1.5rem;
  }

  @media ${breakPoints.phoneOnly},
    (max-width: 68rem) and (max-height: 41.5rem) {
    position: relative;
    margin-bottom: 1.5rem;
    width: calc(100% - 3rem);
    padding: 1.5rem 1.5rem 0 1.5rem;
  }

  @media ${breakPoints.phoneOnly} {
    margin-bottom: 1rem;
    width: 100%;
    height: 2.5rem;
    padding: 1rem 0 0;
  }
`;

export const StyledAirswapButton = styled(AirswapButton)`
  display: block;
  justify-self: flex-start;
  margin: -0.25rem auto 0 -0.25rem;

  @media ${breakPoints.tabletPortraitUp} {
    display: none;
  }
`;

export const StyledMenuButton = styled(IconButton)`
  ${BorderedPill};
  ${InputOrButtonBorderStyle};

  margin-left: 0.5rem;
  width: 3rem;
  height: 3rem;
  padding: 0;

  @media ${breakPoints.tabletPortraitUp} {
    display: none;
  }

  @media ${breakPoints.phoneOnly} {
    ${IconButtonStyle};
    margin-left: 0;
    width: 2rem;
    height: 2rem;

    svg {
      width: 1.3125rem;
    }
  }
`;

export const StyledSettingsButton = styled(SettingsButton)`
  margin-left: 0.5rem;
  margin-right: 0;

  @media ${breakPoints.tabletPortraitUp} {
    margin-right: 1rem;
  }
`;
