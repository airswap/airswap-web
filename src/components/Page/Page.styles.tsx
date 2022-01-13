import styled from "styled-components/macro";

import { Wallet } from "../../features/wallet/Wallet";
import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";

type StyledWalletProps = {
  isOpen?: boolean;
};

export const StyledWallet = styled(Wallet)<StyledWalletProps>`
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
`;

export const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 18rem;
  height: 100vh;
  min-height: 35rem;

  @media (min-height: ${sizes.toolbarMaxHeight}) {
    padding-top: 2rem;
    min-height: inherit;
  }

  @media ${breakPoints.tabletPortraitUp} {
    padding-left: ${sizes.toolBarWidth};
  }

  @media ${breakPoints.tabletLandscapeUp} {
    padding-left: 0;
  }

  @media ${breakPoints.phoneLandscape} {
    display: none;
  }

  @media ${breakPoints.phoneOnly} {
    display: none;
  }
`;
