import StyledTokenLogo, { StyledTokenLogoProps } from "./TokenLogo.styles";
import { BaseHTMLAttributes, FC } from "react";

export type TokenLogoProps = {
  logoURI?: string;
  className?: string;
} & StyledTokenLogoProps &
  BaseHTMLAttributes<HTMLImageElement>;

const TokenLogo: FC<TokenLogoProps> = ({ logoURI, ...rest }) => {
  return <StyledTokenLogo logoURI={logoURI} {...rest} />;
};

export default TokenLogo;
