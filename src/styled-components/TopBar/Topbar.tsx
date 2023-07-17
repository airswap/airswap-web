import styled from "styled-components/macro";

import ChainSelector from "../../components/ChainSelector/ChainSelector";
import IconButton from "../../components/IconButton/IconButton";
import { IconButtonStyle } from "../../components/IconButton/IconButton.styles";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import WalletButton from "../../components/WalletButton/WalletButton";
import breakPoints from "../../style/breakpoints";
import { BorderedPill, InputOrButtonBorderStyle } from "../../style/mixins";
import { AirswapButton } from "../AirswapButton/AirswapButton";

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  box-sizing: content-box;
  top: 0;
  right: 0;
  width: calc(100% - 3rem);
  height: 3rem;
  padding: 1.5rem;
  z-index: 1;

  @media ${breakPoints.tabletPortraitUp} {
    width: auto;
    padding: 1.5rem;
  }

  @media ${breakPoints.phoneOnly}, ${breakPoints.shallowScreenOnly} {
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

  width: 3rem;
  height: 3rem;
  padding: 0;
  border: none;

  @media ${breakPoints.tabletPortraitUp} {
    display: none;
  }

  @media ${breakPoints.phoneOnly} {
    ${IconButtonStyle};
    margin-left: 0;
    width: 2.5rem;
    height: 2.5rem;

    svg {
      width: 1.3125rem;
    }
  }
`;

export const StyledSettingsButton = styled(SettingsButton)`
  @media ${breakPoints.tabletPortraitUp} {
    order: 2;
    margin-right: 1rem;
  }
`;

export const StyledWalletButton = styled(WalletButton)`
  margin-right: 0.5rem;

  @media ${breakPoints.tabletPortraitUp} {
    order: 3;
    margin-right: 0;
  }
`;

export const StyledChainSelector = styled(ChainSelector)`
  margin-right: 0.5rem;

  @media ${breakPoints.tabletPortraitUp} {
    order: 1;
    margin-right: 1rem;
  }
`;
