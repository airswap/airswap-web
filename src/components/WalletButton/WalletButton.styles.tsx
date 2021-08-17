import Blockies from "react-blockies";

import styled from "styled-components/macro";

import Button from "../Button/Button";

export const Container = styled.div``;

export const StyledWalletButton = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  background-color: ${(props) =>
    props.theme.name === "dark" ? props.theme.colors.darkGrey : "#F4F4F4"};
`;

export const BlockiesContainer = styled.div`
  position: relative;
`;

export const StyledBlockies = styled(Blockies)`
  border-radius: 50%;
  position: relative;
`;

export const GreenCircle = styled.div`
  position: absolute;
  background-color: #60ff66;
  border-radius: 50%;
  z-index: 5;
  width: 0.5rem;
  height: 0.5rem;
  top: 1rem;
  left: 1rem;
`;

export const WalletExtension = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  padding: 0 1rem 1rem 1rem;
  z-index: 100;
  background-color: ${(props) =>
    props.theme.name === "dark" ? props.theme.colors.darkGrey : "#F4F4F4"};
`;

export const Line = styled.hr`
  border-top: 1px solid ${(props) => props.theme.colors.borderGrey};
  width: 80%;
`;

export const Span = styled.span`
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const ExitButton = styled.button`
  margin-left: 5rem;
`;

type TransactionContainerProps = {
  flex: boolean;
};

export const TransactionContainer = styled.div<TransactionContainerProps>`
  display: ${(props) => (props.flex ? "flex" : "block")};
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 12rem;
`;

export const DisconnectButton = styled(Button)`
  border: 1px solid ${(props) => props.theme.colors.lightGrey};
  padding: 1rem 3rem;
  background-color: transparent;
  color: ${(props) => props.theme.colors.lightGrey};
  transition: 0.25s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.colors.black};
    background-color: ${(props) => props.theme.colors.white};
  }
`;
