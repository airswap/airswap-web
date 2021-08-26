import { TokenInfo } from "@uniswap/token-lists";

import stringToSignificantDecimals from "../../../../helpers/stringToSignificantDecimals";
import TokenLogo from "../../../TokenLogo/TokenLogo";
import TokenDeleteButton from "../TokenDeleteButton/TokenDeleteButton";
import {
  Container,
  Symbol,
  TokenName,
  Balance,
  TokenNameContainer,
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
};

// TODO: Make Container a button instead of a Balance
const TokenButton = ({
  token,
  balance,
  setToken,
  removeActiveToken,
  disabled,
}: TokenRowProps) => {
  return (
    <Container
      onClick={(e) => {
        !disabled && setToken(token.address);
      }}
      disabled={disabled!}
    >
      <TokenLogo tokenInfo={token} size="small" />

      <Symbol>{token.symbol}</Symbol>

      <TokenNameContainer>
        <TokenName>{token.name}</TokenName>

        <TokenDeleteButton
          onClick={(e) => {
            e.stopPropagation();
            removeActiveToken(token.address);
          }}
        />
      </TokenNameContainer>

      <Balance>{stringToSignificantDecimals(balance)}</Balance>
    </Container>
  );
};

export default TokenButton;
