import { FC, ReactElement } from "react";

import { TokenKinds } from "@airswap/utils";

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
  tokenKind?: TokenKinds;
  tokenUri?: string;
  className?: string;
}

const OrderReviewToken: FC<OrderReviewTokenProps> = ({
  amount,
  label,
  tokenSymbol,
  tokenKind,
  tokenUri,
  className = "",
}): ReactElement => {
  const isNft =
    tokenKind === TokenKinds.ERC721 || tokenKind === TokenKinds.ERC1155;

  return (
    <Container className={className}>
      <Label>{label}</Label>
      <Amount>{amount}</Amount>
      <Symbol isNft={isNft}>{tokenSymbol}</Symbol>
      <StyledTokenLogo logoURI={tokenUri} />
    </Container>
  );
};

export default OrderReviewToken;
