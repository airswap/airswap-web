import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';

export const StyledSwapWidget = styled.div<{ theme: ThemeProps }>`
  .header {
    margin-bottom: 3rem;
    min-height: 2rem;
  }

  .quote-and-timer {
    display: flex;
    margin-bottom: 1rem;
  }

  .token-select:last-of-type {
    margin-bottom: 3rem;
  }

  .submit-button {
    margin-bottom: 2.75rem;
  }
`;

export default StyledSwapWidget;
