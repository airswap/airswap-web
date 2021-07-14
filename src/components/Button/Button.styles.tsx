import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';
import { ButtonIntent, ButtonProps } from './Button';

function getButtonBackground(theme: ThemeProps, intent?: ButtonIntent): string {
  switch (intent) {
    case 'destructive':
      return theme.colors.red;
    case 'positive':
      return theme.colors.green;
    case 'neutral':
      return theme.colors.lightGrey;
    default:
      return theme.colors.primary;
  }
}

export const StyledButton = styled.button<{ theme: ThemeProps } & ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justifyContent || 'center'};
  width: 100%;
  height: 3.5rem;
  padding: 0 1rem;
  font-size: 1.125rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.colors.white};
  background: ${props => getButtonBackground(props.theme, props.intent)};
  pointer-events: ${props => props.disabled ? 'none' : 'visible'};
  cursor: ${props => props.disabled ? 'none' : 'pointer'};
  
  .text {
    margin-right: ${props => props.loading ? '1rem' : 0};
    transition: opacity 0.3s ease-out;
    opacity: ${props => props.disabled ? 0.5 : 1};
  }
`;
