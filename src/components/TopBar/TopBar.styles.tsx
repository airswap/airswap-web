import styled from "styled-components/macro";

import { Wallet } from "../../features/wallet/Wallet";
import breakPoints from "../../style/breakpoints";
import { AirswapButton } from "../../styled-components/AirswapButton/AirswapButton";
import IconButton from "../IconButton/IconButton";
import SettingsButton from "../SettingsButton/SettingsButton";

export const StyledTopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row-reverse;
  position: absolute;
  box-sizing: content-box;
  top: 0;
  right: 0;
  width: 100%;
  height: 3rem;
  padding: 1.5rem;
  z-index: 1;

  @media ${breakPoints.tabletPortraitUp} {
    flex-direction: row;
  }

  @media ${breakPoints.phoneOnly},
    (max-width: 68rem) and (max-height: 41.5rem) {
    position: relative;
    margin-bottom: 1.5rem;
    width: calc(100% - 2.5rem);
    padding: 1.5rem 1.5rem 0 1rem;
  }

  @media ${breakPoints.phoneOnly} {
    margin-bottom: 1rem;
    width: 100%;
    height: 2.5rem;
    padding: 1rem 0 0;
  }
`;

export const StyledWallet = styled(Wallet)<{ isOpen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  top: 2rem;
  right: 2rem;
  transition: transform 0.3s ease-in-out;
  z-index: 1001;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.phoneOnly} {
    position: relative;
    top: 0;
    left: 0;
    transition: none;
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
  display: flex;
  margin-left: 0.5rem;

  @media ${breakPoints.tabletPortraitUp} {
    display: none;
  }

  @media ${breakPoints.phoneOnly} {
    margin-left: 0;

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
