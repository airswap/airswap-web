import styled from "styled-components";

import TransactionLink from "../WalletButton/subcomponents/TransactionLink/TransactionLink";

type BackgroundOverlayProps = {
  open: boolean;
};

const BackgroundOverlay = styled.div<BackgroundOverlayProps>`
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

const Container = styled.div<ContainerProps>`
  position: absolute;
  width: 24rem;
  height: 100vh;
  padding: 1.375rem 1.5rem;
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

const WalletHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 6rem;
`;

const BlockiesContainer = styled.div`
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

const WalletLinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1rem 1.125rem 1.5rem;
  height: 3rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 2500px;
`;

const StyledTransactionLink = styled(TransactionLink)`
  justify-self: flex-end;
  margin-left: auto;

  &:hover {
    color: ${(props) => props.theme.colors.alwaysWhite};
  }
`;

export {
  BackgroundOverlay,
  Container,
  WalletHeader,
  BlockiesContainer,
  WalletLinkContainer,
  StyledTransactionLink,
};
