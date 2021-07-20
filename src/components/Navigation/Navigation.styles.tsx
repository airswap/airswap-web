import styled from 'styled-components/macro';
import { ThemeProps } from '../../style/themes';
import Icon from '../Icon/Icon';

export const NavigationButton = styled.a<{ theme: ThemeProps }>`
  display: flex;
  align-items: center;
  border-top: 1px solid ${props => props.theme.colors.grey};
  width: 100%;
  height: 4.5rem;
  padding-left: 2.625rem;
  font-size: ${props => props.theme.typography.nav.fontSize};
  font-weight: ${props => props.theme.typography.nav.fontWeight};
  line-height: ${props => props.theme.typography.nav.lineHeight};
  text-decoration: none;

  &:hover {
    opacity: 0.5;
  }

  &:last-of-type {
    border-bottom: 1px solid ${props => props.theme.colors.grey};
  }
`;

export const NavigationButtonIcon = styled(Icon)<{ theme: ThemeProps }>`
  margin-right: 1.5rem;
  color: ${props => props.theme.colors.grey};
`;

export const StyledNavigation = styled.nav<{ theme: ThemeProps }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
`;
