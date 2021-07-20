import React, { FC, ReactElement } from 'react';
import { Container, StyledTradeContainer } from './TradeContainer.styles';

const TradeContainer: FC = ({ children }): ReactElement => {

  return (
   <StyledTradeContainer>
     <Container>
       { children }
     </Container>
   </StyledTradeContainer>
  )
};

export default TradeContainer;
