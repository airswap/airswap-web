import { motion } from "framer-motion";
import styled, { css } from "styled-components/macro";

import convertHexToRGBA from "../../helpers/transformHexToRgba";
import breakPoints from "../../style/breakpoints";
import {
  ScrollBarStyle,
  InputOrButtonBorderStyleType2,
  BorderlessButtonStyle,
} from "../../style/mixins";
import Button from "../Button/Button";
import { InfoSubHeading } from "../Typography/Typography";
import WalletInfoButton from "./subcomponents/WalletInfoButton/WalletInfoButton";
import WalletMobileMenu from "./subcomponents/WalletMobileMenu/WalletMobileMenu";

export const Container = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(53, 69, 98, 0.5);
  width: 100%;
  max-width: 28.25rem;
  height: 100%;
  padding: 1.5rem 0.75rem 0 0.5rem;
  will-change: transform;
  backdrop-filter: drop-shadow(4px 4px 10px blue);
  background: #0b1730;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  @media ${breakPoints.phoneOnly} {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: inherit;
    height: 100%;
    padding: 1rem 1rem 0;
    background-color: ${({ theme }) => theme.colors.black};
    z-index: 1000;
  }
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  width: 100%;
`;

export const WalletHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  width: 100%;
  height: 3rem;
  padding-left: 1rem;

  @media ${breakPoints.phoneOnly} {
    padding-left: 0;
  }
`;

export const LegendContainer = styled.div<{ $isVisible?: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ $isVisible }) => ($isVisible ? ".75rem" : "0")};
  padding-inline: 1.5rem;
  width: 100%;
  height: ${({ $isVisible }) => ($isVisible ? "1rem" : "0")};
  visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
  transition: height ease-out 0.3s, margin-bottom ease-out 0.3s;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Legend = styled(InfoSubHeading)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1rem;
  width: 100%;
  text-transform: uppercase;
  background: transparent;
  color: ${(props) => props.theme.colors.lightGrey};
`;

type TransactionsContainerProps = {
  hasOverflow: boolean;
};

export const TransactionsContainer = styled.div<TransactionsContainerProps>`
  ${ScrollBarStyle};

  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 1rem;
  padding-left: 0;
  padding-right: 0;

  flex-grow: 99;
  height: 100%;
`;

export const TransactionContainer = styled.div<{ $isEmpty?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-grow: 2;
  margin-bottom: ${({ $isEmpty }) => ($isEmpty ? "0" : "1.5rem")};
  width: 100%;
  padding-right: 0.75rem;
  padding-left: 0.25rem;
  transition: margin-bottom ease-out 0.3s;
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const NoTransactions = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-block-start: 1rem;
  height: 4.5rem;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const BottomButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0 2rem;
`;

export const DisconnectButton = styled(Button)`
  ${InputOrButtonBorderStyleType2};

  width: calc(100% - 1.25rem);

  @media ${breakPoints.phoneOnly} {
    display: none;
  }
`;

export const ConnectButton = styled(DisconnectButton)``;

export const MobileBackButton = styled(Button)`
  ${InputOrButtonBorderStyleType2};
  display: none;

  @media ${breakPoints.phoneOnly} {
    display: flex;
    width: 100%;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  width: 2.5rem;
  min-height: 2.5rem;
  background-color: rgb(110, 118, 134, 0.1);
  color: ${(props) => props.theme.colors.lightGrey};
  border-radius: 50%;
`;

export const ConnectionStatusCircle = styled.div<{ $connected: boolean }>`
  margin-right: 0.5rem;
  width: 0.75rem;
  height: 0.75rem;
  background-color: ${(props) =>
    props.$connected ? props.theme.colors.green : props.theme.colors.red};
  border-radius: 50%;
`;

export const DesktopWalletInfoButton = styled(WalletInfoButton)`
  @media ${breakPoints.phoneOnly} {
    display: none;
  }
`;

export const MobileWalletInfoButton = styled(WalletInfoButton)`
  display: none;

  @media ${breakPoints.phoneOnly} {
    display: flex;
  }
`;

export const StyledWalletMobileMenu = styled(WalletMobileMenu)`
  display: none;
  position: absolute;
  top: 4.5rem;
  right: 1rem;
  z-index: 2;

  @media ${breakPoints.phoneOnly} {
    display: flex;
  }
`;

export const BackdropFilter = styled.button`
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  border: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => convertHexToRGBA(theme.colors.black, 0.5)};
  backdrop-filter: blur(2px);
  z-index: 1;

  @media ${breakPoints.phoneOnly} {
    display: block;
  }
`;

export const TransactionsTabNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2.25rem;
  margin-left: 1rem;
  width: calc(100% - 3.5rem);
  min-height: 2.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderGrey};
`;

export const TransactionsTabNavigationButton = styled.button<{
  isActive?: boolean;
}>`
  ${BorderlessButtonStyle};

  display: flex;
  height: calc(100% + 1px);
  border-bottom: 1px solid transparent;
  text-transform: uppercase;
  font-size: 0.875rem;
  font-weight: 700;
  padding-top: 0.25rem;
  color: ${({ theme }) => theme.colors.lightGrey};
  background-color: transparent;
  cursor: pointer;

  ${({ isActive }) =>
    isActive &&
    css`
      border-bottom: 1px solid ${({ theme }) => theme.colors.white} !important;
      color: ${({ theme }) => theme.colors.white};
    `}

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.white};
  }
`;
