import styled from 'styled-components';
import TokenSelect from '../TokenSelect/TokenSelect';
import Button from '../Button/Button';

export const Header = styled.div`
  margin-bottom: 3rem;
  min-height: 2rem;
`;

export const QuoteAndTimer = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

export const StyledTokenSelect = styled(TokenSelect)`

  &:last-of-type {
    margin-bottom: 3rem;
  }
`;

export const SubmitButton = styled(Button)`
  margin-bottom: 2.75rem;
`;

export const StyledSwapWidget = styled.div``;

export default StyledSwapWidget;
