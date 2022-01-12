import styled from "styled-components/macro";

import { Wallet } from "../../features/wallet/Wallet";
import breakPoints, { breakpointSizes } from "../../style/breakpoints";
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

export const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;

  @media ${breakPoints.phoneOnly} {
    display: block;
    height: auto;
  }
`;

export const StyledPage = styled.div`
  position: relative;
  min-width: 18rem;
  height: 100vh;
  min-height: 35rem;

  @media ${breakPoints.phoneOnly} {
    display: block;
    width: 100%;
    min-height: auto;
    padding: 4rem ${sizes.pageMobilePadding};
  }

  @media (min-height: 38rem) and (max-width: ${breakpointSizes.phone}) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    padding-top: 0;
    padding-bottom: 0;
  }
`;
