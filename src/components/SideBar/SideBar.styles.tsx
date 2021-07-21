import styled from "styled-components/macro";
import breakPoints from "../../style/breakpoints";
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch";
import { Wallet } from "../../features/wallet/Wallet";

interface StyledSideBarProps {
  open: boolean;
}

export const StyledDarkModeSwitch = styled(DarkModeSwitch)`
  position: absolute;
  bottom: 2.5rem;
  right: 2.5rem;
`;

export const StyledWallet = styled(Wallet)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
`;

export const StyledSideBar = styled.div<StyledSideBarProps>`
  transition: transform 0.5s ease-out;
  transform: ${(props) => (props.open ? "none" : "translateX(27rem)")};

  display: none;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  border-left: 1px solid ${(props) => props.theme.colors.grey};
  width: 27rem;
  height: 100%;
  min-height: 100vh;
  padding: 3.25rem 0;
  background: ${(props) => props.theme.colors.darkGrey};

  @media ${breakPoints.tabletLandscapeUp} {
    display: flex;
  }
`;
