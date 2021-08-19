import styled from "styled-components";

import TransactionLink from "../TransactionLink/TransactionLink";
import WalletTransactionStatus from "../WalletTransactionStatus/WalletTransactionStatus";

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;

  & + & {
    margin-top: 1.25rem;
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
`;

export const SpanSubtitle = styled.span`
  line-height: 1.3;
  font-size: 1rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.lightGrey};
`;

export const StyledTransactionLink = styled(TransactionLink)`
  justify-self: flex-end;
  margin-left: auto;

  &:hover {
    color: ${(props) => props.theme.colors.alwaysWhite};
  }
`;
