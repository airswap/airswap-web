import {
  GlobalStyle,
  BorderBottom,
  BorderRight,
  BorderTop,
} from "./TokenSelectFocusBorder.styles";
import { FC } from "react";

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
      <BorderRight position={position} hasError={hasError} />
      <BorderTop position={position} hasError={hasError} />
      <BorderBottom position={position} hasError={hasError} />
    </>
  );
};

export default TokenSelectFocusBorder;
