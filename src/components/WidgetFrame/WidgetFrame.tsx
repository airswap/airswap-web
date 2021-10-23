import React, { FC, ReactElement } from "react";

import { Container, StyledTradeContainer } from "./WidgetFrame.styles";

type TradeContainerProps = {
  isOpen?: boolean;
};

const WidgetFrame: FC<TradeContainerProps> = ({
  children,
  isOpen = false,
}): ReactElement => {
  return (
    <StyledTradeContainer isOpen={isOpen}>
      <Container>{children}</Container>
    </StyledTradeContainer>
  );
};

export default WidgetFrame;
