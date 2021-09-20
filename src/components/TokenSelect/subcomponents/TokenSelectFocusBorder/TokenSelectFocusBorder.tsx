import { FC } from "react";

import {
  GlobalStyle,
  BorderBottom,
  BorderRight,
  BorderTop,
} from "./TokenSelectFocusBorder.styles";

type TokenSelectFocusBorderProps = {
  position?: "left" | "right";
};

const TokenSelectFocusBorder: FC<TokenSelectFocusBorderProps> = ({
  position = "right",
}) => {
  return (
    <>
      <GlobalStyle />
      <BorderRight position={position} />
      <BorderTop position={position} />
      <BorderBottom position={position} />
    </>
  );
};

export default TokenSelectFocusBorder;
