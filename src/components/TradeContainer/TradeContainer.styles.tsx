import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';

export const StyledTradeContainer = styled.div<{ theme: ThemeProps }>`
  display: flex;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 2.25rem;
  width: 100%;
  max-width: 34.5rem;
  background: url("/images/bg.png");
  background-size: 100% 100%;
  
  @media (min-resolution: 144dpi) {
    background-image: url("/images/bg-x2.png");
  }
 `;

export const StyledInnerContent = styled.div<{ theme: ThemeProps }>`
  display: flex;
  flex-direction: column;
  padding: 2.25rem;
  width: 100%;
  background: ${props => props.theme.colors.black};
  overflow: hidden;
 `;