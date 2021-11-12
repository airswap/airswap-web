import styled, { css } from "styled-components/macro";

import Icon from "../../../Icon/Icon";
import TransactionLink from "../TransactionLink/TransactionLink";
import WalletTransactionStatus from "../WalletTransactionStatus/WalletTransactionStatus";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 4.125rem;
  padding: 0 1.5rem;
  gap: 1rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 0.1875rem;
  color: ${({ theme }) =>
    theme.name === "dark" ? theme.colors.white : theme.colors.primary};

  & + & {
    margin-top: 0.5rem;
  }

  &:hover {
    border-color: ${(props) => props.theme.colors.lightGrey};
  }
`;

export const StyledWalletTransactionStatus = styled(WalletTransactionStatus)``;

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
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
  ${({ hasProgress }) =>
    hasProgress &&
    css`
      margin-bottom: 0.5rem;
    `}
`;

export const SpanSubtitle = styled.span`
  line-height: 1.25rem;
  font-size: 1rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const StyledTransactionLink = styled(TransactionLink)`
  align-items: center;
  &:hover {
    color: ${(props) => props.theme.colors.white};
  }
`;

export const RotatedIcon = styled(Icon)`
  transform: rotate(45deg);
  margin-left: -0.5rem;
`;
