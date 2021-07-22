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
 `;

export default StyledSwapWidget;
