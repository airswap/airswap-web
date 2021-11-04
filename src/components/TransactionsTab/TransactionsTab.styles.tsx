import styled from "styled-components";

import { ScrollBar } from "../../style/mixins";
import Button from "../Button/Button";
import { InfoSubHeading } from "../Typography/Typography";
import { InfoHeading } from "../Typography/Typography";
import TransactionLink from "./subcomponents/TransactionLink/TransactionLink";

type BackgroundOverlayProps = {
  open: boolean;
};

export const BackgroundOverlay = styled.div<BackgroundOverlayProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  transform: scale(${(props) => (props.open ? "1" : "0")});
  z-index: 1000;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

type ContainerProps = {
  open: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 24rem;
  height: 100vh;
  padding: 0 1.5rem;
  background-color: ${(props) => props.theme.colors.black};
  border-left: 1px solid ${(props) => props.theme.colors.borderGrey};
  top: 0;
  right: 0;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(24rem)")};
  transition: transform 0.3s ease-in-out;
  z-index: 1001;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const WalletHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 3rem;
  margin: 1.5rem 0;
`;

export const BlockiesContainer = styled.div`
  position: relative;
  margin-right: 2.5rem;

  &::after {
    display: block;
    content: "";
    position: absolute;
    background-color: ${(props) => props.theme.colors.green};
    border-radius: 50%;
    z-index: 5;
    width: 0.75rem;
    height: 0.75rem;
    top: 1.75rem;
    left: 1.75rem;
  }
`;

export const WalletAddress = styled(InfoHeading)`
  font-size: 1rem;
`;

export const WalletLinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.125rem 1rem 1.125rem 1.5rem;
  height: 3rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2500px;
`;

export const StyledTransactionLink = styled(TransactionLink)`
  justify-self: flex-end;
  margin-left: auto;

  &:hover {
    color: ${(props) => props.theme.colors.alwaysWhite};
  }
`;

export const Legend = styled(InfoSubHeading)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1rem;
  color: ${(props) => props.theme.colors.lightGrey};
  &:after {
    margin: 0 0 0 0.5rem;
    background: ${(props) => props.theme.colors.borderGrey};
    height: 1px;
    flex: 1;
    content: "";
  }

  &:before {
    background: none;
  }
`;

export const LegendLine = styled.span`
  background: transparent;
`;

type TransactionsContainerProps = {
  $overflow: boolean;
};

export const TransactionsContainer = styled.div<TransactionsContainerProps>`
  overflow-y: ${(props) => (props.$overflow ? "scroll" : "hidden")};

  flex-grow: 99;
  height: 100%;
  padding-bottom: 1rem;

  ${ScrollBar}
`;

export const TransactionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-grow: 2;
  padding: 1.5rem 0;
  width: 100%;
`;

export const NoTransactions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
  margin: 0.25rem 0;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const DiconnectButtonContainer = styled.div`
  padding: 1.5rem 0 1rem 0;
`;

export const DisconnectButton = styled(Button)`
  margin-top: auto;
  justify-self: flex-end;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2px;
  height: 2.875rem;
  padding: 1rem 3rem;
  font-size: 0.875rem;
  font-weight: 700;
  background-color: transparent;

  &:hover {
    color: ${(props) => props.theme.colors.white};
    border-color: ${(props) => props.theme.colors.white};
    background: none;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgb(110, 118, 134, 0.1);
  color: ${(props) => props.theme.colors.lightGrey};
  border-radius: 50%;
`;
