import React, { FC, ReactElement } from 'react';
import { StyledTradeContainer } from './TradeContainer.styles';

const TradeContainer: FC = ({ children }): ReactElement => {

  return (
   <StyledTradeContainer>
     <div className="container-children">
       { children }
     </div>
   </StyledTradeContainer>
  )
};

export default TradeContainer;
