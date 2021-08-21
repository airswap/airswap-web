import React, { FC, ReactElement } from "react";

import { Container, StyledTradeContainer } from "./TradeContainer.styles";

type TradeContainerProps = {
  isOpen?: boolean;
};

const TradeContainer: FC<TradeContainerProps> = ({
  children,
  isOpen = false,
}): ReactElement => {
  return (
    <StyledTradeContainer isOpen={isOpen}>
      <Container>{children}</Container>
    </StyledTradeContainer>
  );
};

export default TradeContainer;
