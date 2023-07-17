import { useTranslation } from "react-i18next";

import { TokenInfo } from "@airswap/types";

import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import TokenLogo from "../../../TokenLogo/TokenLogo";
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
} from "./TokenButton.styles";

export type TokenRowProps = {
  /**
   * TokenInfo object
   */
  token: TokenInfo;
  /**
   * Balance of current token
   */
  balance: string;
  /**
   * onClick event, either setSignerToken or setSenderToken
   */
  setToken: (val: string) => void;
  /**
   * Whether to disable selection of this token (e.g. if already selected)
   */
  disabled?: boolean;
  /**
   * Removes token from the active tokens list.
   */
  removeActiveToken: (tokenAddress: string) => void;
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
  const onClickHandler = () => {
    if (disabled) {
      return;
    }

    if (!showDeleteButton) {
      setToken(token.address);
    } else {
      removeActiveToken(token.address);
    }
  };

  return (
    <Container
      onClick={onClickHandler}
      disabled={disabled}
      showDeleteButton={showDeleteButton}
    >
      <TokenLogo logoURI={token.logoURI} size="small" />

      <TokenSymbolAndName>
        <Symbol>{token.symbol}</Symbol>
        <TokenNameContainer>
          <TokenName>{token.name}</TokenName>
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
