import { FC } from "react";

import {
  Container,
  TokenSelectLeftGradientBackground,
  BorderBackground,
  TokenSelectRightGradientBackground,
  TokenSelectLeftBorderBackground,
} from "./TokenSelectBackground.styles";

interface TokenSelectBackgroundProps {
  className?: string;
}

const TokenSelectBackground: FC<TokenSelectBackgroundProps> = ({
  className,
}) => {
  return (
    <Container className={className}>
      <BorderBackground />
      <TokenSelectLeftBorderBackground />
      <TokenSelectRightGradientBackground />
      <TokenSelectLeftGradientBackground />
      <TokenSelectRightGradientBackground />
    </Container>
  );
};

export default TokenSelectBackground;
