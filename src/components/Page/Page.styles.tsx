import styled from "styled-components/macro";

import { Wallet } from "../../features/wallet/Wallet";
import breakPoints, { breakpointSizes } from "../../style/breakpoints";
import { sizes } from "../../style/sizes";
import SocialButtons from "../SocialButtons/SocialButtons";

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

  @media ${breakPoints.phoneOnly} {
    position: relative;
    top: 0;
    left: 0;
    transition: none;
  }
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;

  @media ${breakPoints.phoneOnly},
    (max-width: 68rem) and (max-height: 41.5rem) {
    justify-content: flex-start;
    height: auto;
  }

  @media ${breakPoints.phoneOnly} {
    height: 100%;
  }
`;

export const TopBar = styled.div`
  position: absolute;
  padding: 1.5rem 1.5rem 0;
  top: 0;
  right: 0;
  z-index: 1;

  @media ${breakPoints.phoneOnly},
    (max-width: 68rem) and (max-height: 41.5rem) {
    display: flex;
    justify-content: flex-end;
    position: relative;
    margin-bottom: 1.5rem;
    width: 100%;
  }

  @media ${breakPoints.phoneOnly} {
    margin-bottom: 1rem;
    padding: 1rem 0 0;
  }
`;

export const StyledPage = styled.div`
  position: relative;
  min-width: 18rem;
  height: 100vh;
  min-height: 35rem;

  @media (min-height: 33rem) and (max-width: ${breakpointSizes.phone}) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    padding-top: 0;
    padding-bottom: 0;
  }

  @media ${breakPoints.phoneOnly} {
    width: 100%;
    min-height: auto;
    padding: 0 ${sizes.pageMobilePadding};
  }
`;

export const StyledSocialButtons = styled(SocialButtons)`
  display: flex;
  position: fixed;
  bottom: 2.25rem;
  right: 1.5rem;

  @media ${breakPoints.phoneOnly},
    (max-width: 68rem) and (max-height: 41.5rem) {
    display: flex;
    justify-content: flex-end;
    position: relative;
    bottom: 0;
    right: 0;
    width: 100%;
    padding-right: 1.5rem;
    padding-bottom: 1.5rem;
  }

  @media ${breakPoints.phoneOnly} {
    display: none;
  }
`;
