import React, { ReactElement } from "react";

import { Container, StyledTradeContainer } from "./TradeContainer.styles";

type TradeContainerProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

const TradeContainer = ({
  children,
  isOpen,
}: TradeContainerProps): ReactElement => {
  return (
    <StyledTradeContainer isOpen={isOpen}>
      <Container>{children}</Container>
    </StyledTradeContainer>
  );
};

export default TradeContainer;
