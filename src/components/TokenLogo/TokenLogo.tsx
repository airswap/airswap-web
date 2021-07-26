import { BaseHTMLAttributes, FC } from "react";
import { TokenInfo } from "@uniswap/token-lists";
import StyledTokenLogo, { StlyedTokenLogoProps } from "./TokenLogo.styles";

export type TokenLogoProps = {
  tokenInfo: TokenInfo;
} & StlyedTokenLogoProps &
  BaseHTMLAttributes<HTMLImageElement>;

const TokenLogo: FC<TokenLogoProps> = ({ tokenInfo, ...rest }) => {
  return (
    <StyledTokenLogo
      alt={`${tokenInfo.name} logo`}
      src={tokenInfo.logoURI}
      {...rest}
    />
  );
};

export default TokenLogo;
