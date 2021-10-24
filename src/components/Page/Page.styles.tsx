import styled from "styled-components/macro";

import { Wallet } from "../../features/wallet/Wallet";
import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";
import SiteLogo from "../SiteLogo/SiteLogo";
import { StyledPageProps } from "./Page";

export const StyledSiteLogo = styled(SiteLogo)`
  position: absolute;
  top: 2.5rem;
  top: ${(props) => (props.adjustForBookmarkWarning ? "1.2rem" : "2.5rem")};
  left: 2.5rem;
`;

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

export const StyledPage = styled.div<StyledPageProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 18rem;
  min-height: ${(props) =>
    props.adjustForBookmarkWarning ? "calc(100vh - 40px)" : "100vh"};
  padding: 2rem 0 0;

  @media (min-height: 50rem) {
    align-items: center;
    height: ${(props) =>
      props.adjustForBookmarkWarning ? "calc(100vh - 40px)" : "100vh"};
    min-height: 50rem;
  }

  @media ${breakPoints.tabletPortraitUp} {
    padding-left: ${sizes.toolBarWidth};
  }

  @media ${breakPoints.tabletLandscapeUp} {
    padding-left: 0;
  }
`;
