import styled from "styled-components";

import TransactionLink from "../TransactionLink/TransactionLink";
import WalletTransactionStatus from "../WalletTransactionStatus/WalletTransactionStatus";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.125rem 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.borderGrey};
  border-radius: 3px;
  transition: border-color ease-out 0.3s;

  & + & {
    margin-top: 0.5rem;
  }

  &:hover,
  &:focus {
    border-color: ${(props) => props.theme.colors.white};
  }
`;

export const StyledWalletTransactionStatus = styled(WalletTransactionStatus)``;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

export const SpanTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
`;

export const SpanSubtitle = styled.span`
  line-height: 1.25rem;
  font-size: 1rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const StyledTransactionLink = styled(TransactionLink)`
  align-items: center;
  margin-left: auto;

  &:hover {
    color: ${(props) => props.theme.colors.alwaysWhite};
  }
`;
