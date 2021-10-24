import React, { FC, ReactElement } from "react";

import { Container, StyledTradeContainer } from "./WidgetFrame.styles";

const WidgetFrame: FC = ({ children }): ReactElement => {
  return (
    <StyledTradeContainer>
      <Container>{children}</Container>
    </StyledTradeContainer>
  );
};

export default WidgetFrame;
