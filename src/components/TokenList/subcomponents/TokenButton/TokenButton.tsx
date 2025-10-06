import { useTranslation } from "react-i18next";

import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getCollectionTokenName,
  getTokenImage,
  getTokenSymbol,
  isTokenInfo,
} from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import {
  Container,
  Symbol,
  TokenNameContainer,
  TokenName,
  Balance,
  DeleteIcon,
  TokenSymbolAndName,
  StyledIcon,
  Tooltip,
  StyledTokenLogo,
} from "./TokenButton.styles";

export type TokenRowProps = {
  /**
   * TokenInfo object
   */
  token: AppTokenInfo;
  /**
   * Balance of current token
   */
  balance: string;
  /**
   * onClick event, either setSignerToken or setSenderToken
   */
  setToken: (tokenInfo: AppTokenInfo) => void;
  /**
   * Whether to disable selection of this token (e.g. if already selected)
   */
  disabled?: boolean;
  /**
   * Removes token from the active tokens list.
   */
  removeActiveToken: (tokenInfo: AppTokenInfo) => void;
  /**
   * Show delete button
   */
  showDeleteButton?: boolean;
};

const TokenButton = ({
  token,
  balance,
  setToken,
  removeActiveToken,
  disabled = false,
  showDeleteButton = false,
}: TokenRowProps) => {
  const { t } = useTranslation();

  const logoImage = getTokenImage(token);
  const symbol = getTokenSymbol(token);
  const tokenName = isTokenInfo(token)
    ? token.name
    : getCollectionTokenName(token);

  const onClickHandler = () => {
    if (disabled) {
      return;
    }

    if (!showDeleteButton) {
      setToken(token);
    } else {
      removeActiveToken(token);
    }
  };

  return (
    <Container
      onClick={onClickHandler}
      disabled={disabled}
      showDeleteButton={showDeleteButton}
    >
      <StyledTokenLogo logoURI={logoImage} />

      <TokenSymbolAndName>
        <Symbol>{symbol}</Symbol>
        <TokenNameContainer>
          <TokenName>{tokenName}</TokenName>
          <StyledIcon chainId={token.chainId} address={token.address} />
          <Tooltip>{t("common.verifyToken")}</Tooltip>
        </TokenNameContainer>
      </TokenSymbolAndName>

      {showDeleteButton ? (
        <DeleteIcon name="deny" />
      ) : (
        <Balance>{stringToSignificantDecimals(balance)}</Balance>
      )}
    </Container>
  );
};

export default TokenButton;
