import { useTranslation } from "react-i18next";

import { TokenInfo } from "@uniswap/token-lists";

import {
  Container,
  Image,
  ImageContainer,
  TextContainer,
  Symbol,
  TokenName,
  Span,
  ImportButton,
} from "./TokenImportButton.styles";

export type TokenImportRowProps = {
  /**
   * TokenInfo object
   */
  token: TokenInfo;
  /**
   * onClick event, either setSignerToken or setSenderToken
   */
  onClick: (val: string) => void;
};

const TokenImportButton = ({ token, onClick }: TokenImportRowProps) => {
  const { t } = useTranslation(["balances", "common"]);

  return (
    <Container>
      <ImageContainer>
        <Image
          src={token.logoURI || "https://via.placeholder.com/150"}
          alt={token.address}
        />
      </ImageContainer>

      <TextContainer>
        <Symbol>{token.symbol}</Symbol>
        <TokenName>{token.name}</TokenName>
      </TextContainer>
      <Span></Span>
      <ImportButton onClick={() => onClick(token.address)}>
        {t("balances:addToTokenSet")}
      </ImportButton>
    </Container>
  );
};

export default TokenImportButton;
