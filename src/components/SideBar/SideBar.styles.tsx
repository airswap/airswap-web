import { Link } from "react-router-dom";

import { motion } from "framer-motion";
import styled from "styled-components";

import { Wallet } from "../../features/wallet/Wallet";
import breakPoints from "../../style/breakpoints";
import { sizes } from "../../style/sizes";
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch";

export const StyledDarkModeSwitch = styled(DarkModeSwitch)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`;

type StyledWalletProps = {
  isOpen: boolean;
};

export const StyledWallet = styled(Wallet)<StyledWalletProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  top: 2rem;
  right: 2rem;
  transform: translateX(
    ${(props) =>
      props.isOpen ? "-2.5rem" : `calc(-4rem - ${sizes.sideBarWidth})`}
  );
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  z-index: 1;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

type ContainerProps = {
  isOpen: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 32rem;
  padding: 4rem;
  transform: translateX(${(props) => (props.isOpen ? "28rem" : "0")});
  transition: transform 0.3s ease-in-out;
  background-color: ${(props) => props.theme.colors.darkGrey};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.phoneOnly} {
    display: none;
  }
`;

export const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  left: -1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.darkGrey};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.white};
`;

export const Navigation = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

type StyledLinkProps = {
  primary: boolean;
};

export const StyledLink = styled(Link)<StyledLinkProps>`
  font-weight: ${(props) => (props.primary ? 700 : 500)};
  color: ${(props) => props.theme.colors.white};
`;

export const ContentContainer = styled(motion.div)`
  padding: 1rem 0;

  .hidden {
    color: purple;
  }
`;
