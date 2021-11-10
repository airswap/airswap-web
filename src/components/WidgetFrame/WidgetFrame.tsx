import React, { FC, ReactElement } from "react";

import { Container, StyledTradeContainer } from "./WidgetFrame.styles";

type WidgetFrameType = {
  children?: React.ReactNode;
  open?: boolean;
};

const WidgetFrame: FC<WidgetFrameType> = ({ children, open }): ReactElement => {
  return (
    <StyledTradeContainer open={open}>
      <Container>{children}</Container>
    </StyledTradeContainer>
  );
};

export default WidgetFrame;
