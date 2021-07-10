import React, { FC, ReactElement } from 'react';
import { StyledInnerContent, StyledTradeContainer } from './TradeContainer.styles';

const TradeContainer: FC = ({ children }): ReactElement => {

  return (
   <StyledTradeContainer>
     <StyledInnerContent>
       { children }
     </StyledInnerContent>
   </StyledTradeContainer>
  )
};

export default TradeContainer;
