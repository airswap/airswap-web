import { motion } from "framer-motion";
import styled, { css } from "styled-components/macro";

import Icon from "../../../Icon/Icon";
import TransactionLink from "../../../TransactionLink/TransactionLink";
import WalletTransactionStatus from "../WalletTransactionStatus/WalletTransactionStatus";

export const StyledWalletTransactionStatus = styled(WalletTransactionStatus)``;

export const walletTransactionHeight = "5rem";

export const SpanSubtitle = styled.span`
  line-height: 1.25;
  font-size: 0.9375rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const Container = styled(motion.div)<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 0.75rem;
  width: 100%;
  height: ${walletTransactionHeight};
  padding: 1rem 1.5rem;
  gap: 1rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};
  background: ${({ isActive }) =>
    isActive ? "rgba(0, 0, 0, 0.15)" : "transparent"};

  &:hover {
    background: rgba(0, 0, 0, 0.15);

    ${SpanSubtitle} {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  flex-wrap: wrap;
  justify-content: center;
`;

export const SpanTitle = styled.span<{
  hasProgress?: boolean;
}>`
  line-height: 1.25;
  font-size: 1.125rem;
  font-weight: 400;
  ${({ hasProgress }) =>
    hasProgress &&
    css`
      margin-bottom: 0.5rem;
    `}
`;

export const StyledTransactionLink = styled(TransactionLink)`
  align-self: flex-start;
  align-items: center;
  margin-top: 0.125rem;

  &:hover {
    color: ${(props) => props.theme.colors.white};
  }
`;

export const RotatedIcon = styled(Icon)`
  transform: rotate(45deg);
  margin-left: -0.5rem;
`;
