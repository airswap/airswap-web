import { BaseHTMLAttributes, FC } from "react";

import { TokenInfo } from "@airswap/typescript";

import StyledTokenLogo, { StyledTokenLogoProps } from "./TokenLogo.styles";

export type TokenLogoProps = {
  tokenInfo: TokenInfo | null;
  className?: string;
} & StyledTokenLogoProps &
  BaseHTMLAttributes<HTMLImageElement>;

const TokenLogo: FC<TokenLogoProps> = ({ tokenInfo, ...rest }) => {
  return <StyledTokenLogo tokenInfo={tokenInfo} {...rest} />;
};

export default TokenLogo;
