import styled from "styled-components/macro";

import Button from "../Button/Button";
import IconButton from "../IconButton/IconButton";
import { InfoHeading } from "../Typography/Typography";
import WalletAddress from "./subcomponents/WalletAddress/WalletAddress";

export const OpenWallet = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  padding: 1.375rem 1.5rem;
  width: 21.5rem;
  min-height: 21.5rem;
  background: ${(props) => props.theme.colors.darkGrey};
  overflow: hidden;
  z-index: 1000;
`;

export const OpenWalletTopContainer = styled.div`
  display: flex;
  position: relative;
  border-bottom: 1px solid ${(props) => props.theme.colors.borderGrey};
  width: 100%;
  padding-bottom: 1.1875rem;
`;

export const StyledWalletButton = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledWalletAddress = styled(WalletAddress)`
  ${InfoHeading} {
    font-size: 1.125rem;
    font-weight: 700;
  }
`;

export const NoTransactions = styled.span`
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const ExitButton = styled(IconButton)`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  padding: 0.5rem;
  color: ${(props) => props.theme.colors.lightGrey};

  &:hover {
    color: ${(props) => props.theme.colors.alwaysWhite};
  }
`;

type TransactionContainerProps = {
  flex: boolean;
};

export const TransactionContainer = styled.div<TransactionContainerProps>`
  display: ${(props) => (props.flex ? "flex" : "block")};
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-grow: 2;
  padding: 1.25rem 0 1.5rem;
  width: 100%;
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
