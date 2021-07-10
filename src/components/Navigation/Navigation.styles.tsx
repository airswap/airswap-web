import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';
import DarkModeSwitch from '../DarkModeSwitch/DarkModeSwitch';

export const StyledNavigation = styled.div<{ theme: ThemeProps }>`
  display: flex;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
`;

export const StyledNavigationAnchor = styled.a<{ theme: ThemeProps }>`
  font-size: ${props => props.theme.typography.nav.fontSize};
  font-weight: ${props => props.theme.typography.nav.fontWeight};
  line-height: ${props => props.theme.typography.nav.lineHeight};
  text-decoration: none;
  
  & + & {
    margin-left: 7.5%;
  }
  
  &:hover {
    opacity: 0.5;
  }
`;

export const StyledDarkModeSwitch = styled(DarkModeSwitch)`
  margin-left: 5%;
`;
