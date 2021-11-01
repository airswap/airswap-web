import React, { FC, ReactElement } from "react";

import {
  BackgroundBlurriness,
  Container,
  StyledTradeContainer,
} from "./WidgetFrame.styles";

const WidgetFrame: FC = ({ children }): ReactElement => {
  return (
    <StyledTradeContainer>
      <BackgroundBlurriness />
      <Container>{children}</Container>
    </StyledTradeContainer>
  );
};

export default WidgetFrame;
