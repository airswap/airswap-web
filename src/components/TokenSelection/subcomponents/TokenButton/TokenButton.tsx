import { TokenInfo } from "@uniswap/token-lists";

import TokenDeleteButton from "../TokenDeleteButton/TokenDeleteButton";
import {
  Container,
  Image,
  ImageContainer,
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
  /**
   * Flag that determines if this is a default token that is automatically active.
   */
  defaultToken: boolean;
};

// TODO: Make Container a button instead of a Balance
const TokenButton = ({
  token,
  balance,
  setToken,
  removeActiveToken,
  disabled,
  defaultToken,
}: TokenRowProps) => {
  return (
    <Container
      onClick={(e) => {
        !disabled && setToken(token.address);
      }}
      disabled={disabled!}
    >
      <ImageContainer>
        <Image
          src={token.logoURI || "https://via.placeholder.com/150"}
          alt={token.address}
        />
      </ImageContainer>

      <Symbol>{token.symbol}</Symbol>

      <TokenNameContainer>
        <TokenName>{token.name}</TokenName>

        {!defaultToken && (
          <TokenDeleteButton
            onClick={(e) => {
              e.stopPropagation();
              removeActiveToken(token.address);
            }}
          />
        )}
      </TokenNameContainer>

      <Balance>{balance}</Balance>
    </Container>
  );
};

export default TokenButton;
