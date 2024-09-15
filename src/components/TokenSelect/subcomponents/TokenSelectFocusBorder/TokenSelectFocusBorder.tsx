import { FC } from "react";

import {
  GlobalStyle,
  BorderBottom,
  BorderRight,
  BorderTop,
  Background,
} from "./TokenSelectFocusBorder.styles";

type TokenSelectFocusBorderProps = {
  position?: "left" | "right";
  hasError?: boolean;
};

const TokenSelectFocusBorder: FC<TokenSelectFocusBorderProps> = ({
  position = "right",
  hasError = false,
}) => {
  return (
    <>
      <GlobalStyle />
      <Background position={position} />
      <BorderRight position={position} hasError={hasError} />
      <BorderTop position={position} hasError={hasError} />
      <BorderBottom position={position} hasError={hasError} />
    </>
  );
};

export default TokenSelectFocusBorder;
