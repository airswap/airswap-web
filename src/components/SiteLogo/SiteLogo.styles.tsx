import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';

export const StyledSiteLogo = styled.svg<{ theme: ThemeProps }>`
  width: 10rem;
  height: 3.125rem;
  fill: ${props => props.theme.colors.white};
`;