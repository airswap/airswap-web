import { useTranslation } from "react-i18next";

import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getCollectionTokenName,
  getTokenImage,
  getTokenSymbol,
  isTokenInfo,
} from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { ImportButton } from "../../TokenList.styles";
import {
  Container,
  TextContainer,
  Symbol,
  TokenName,
  UnsupportedTokenText,
  StyledTokenLogo,
} from "./TokenImportButton.styles";

export type TokenImportRowProps = {
  /**
   * TokenInfo object
   */
  token: AppTokenInfo;
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

  const isErc20 = isTokenInfo(token);
  const name = isErc20 ? token.name : getCollectionTokenName(token);

  return (
    <Container>
      <StyledTokenLogo logoURI={getTokenImage(token)} />

      <TextContainer>
        {isErc20 && <Symbol>{getTokenSymbol(token)}</Symbol>}
        <TokenName>{name}</TokenName>
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
