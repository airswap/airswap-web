import { BaseHTMLAttributes, FC } from "react";

import StyledTokenLogo, { StyledTokenLogoProps } from "./TokenLogo.styles";

export type TokenLogoProps = {
  logoURI?: string;
  className?: string;
} & StyledTokenLogoProps &
  BaseHTMLAttributes<HTMLImageElement>;

const TokenLogo: FC<TokenLogoProps> = ({ logoURI, ...rest }) => {
  return <StyledTokenLogo logoURI={logoURI} {...rest} />;
};

export default TokenLogo;
