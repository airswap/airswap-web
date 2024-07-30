import { FC, ReactElement } from "react";

import {
  Amount,
  Container,
  Label,
  StyledTokenLogo,
  Symbol,
} from "./OrderReviewToken.styles";

interface OrderReviewTokenProps {
  amount: string;
  label: string;
  tokenSymbol: string;
  tokenUri?: string;
  className?: string;
}

const OrderReviewToken: FC<OrderReviewTokenProps> = ({
  amount,
  label,
  tokenSymbol,
  tokenUri,
  className = "",
}): ReactElement => {
  return (
    <Container className={className}>
      <Label>{label}</Label>
      <Amount>{amount}</Amount>
      <Symbol>{tokenSymbol}</Symbol>
      <StyledTokenLogo logoURI={tokenUri} />
    </Container>
  );
};

export default OrderReviewToken;
