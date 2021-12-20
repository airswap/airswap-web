import React, { FC, ReactElement } from "react";

import { Container, StyledTradeContainer } from "./WidgetFrame.styles";

type WidgetFrameType = {
  children?: React.ReactNode;
  isConnected?: boolean;
  isOpen?: boolean;
};

const WidgetFrame: FC<WidgetFrameType> = ({
  children,
  isOpen,
  isConnected,
}): ReactElement => {
  return (
    <StyledTradeContainer $isOpen={isOpen} $isConnected={isConnected}>
      <Container>{children}</Container>
    </StyledTradeContainer>
  );
};

export default WidgetFrame;
