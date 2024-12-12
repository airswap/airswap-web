import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/utils";

import TokenLogo from "../../../TokenLogo/TokenLogo";
import {
  Container,
  TextContainer,
  Symbol,
  TokenName,
  ImportButton,
  UnsupportedTokenText,
  StyledTokenLogo,
} from "./TokenImportButton.styles";

export type TokenImportRowProps = {
  /**
   * TokenInfo object
   */
  token: TokenInfo;
  /**
   * True if the token isn't currently supported by makers.
   */
  isUnsupported: boolean;
  /**
   * onClick event, either setSignerToken or setSenderToken
   */
  onClick: (val: string) => void;
};

const TokenImportButton = ({
  token,
  onClick,
  isUnsupported,
}: TokenImportRowProps) => {
  const { t } = useTranslation();

  return (
    <Container>
      <StyledTokenLogo logoURI={token.logoURI} />

      <TextContainer>
        <Symbol>{token.symbol}</Symbol>
        <TokenName>{token.name}</TokenName>
      </TextContainer>
      {isUnsupported ? (
        <UnsupportedTokenText>
          {t("balances.unsupportedToken")}
        </UnsupportedTokenText>
      ) : (
        <ImportButton onClick={() => onClick(token.address)}>
          {t("balances.addToTokenSet")}
        </ImportButton>
      )}
    </Container>
  );
};

export default TokenImportButton;
