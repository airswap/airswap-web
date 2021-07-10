import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';
import { ButtonProps } from './Button';

export const StyledButton = styled.button<{ theme: ThemeProps } & ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justifyContent || 'center'};
  width: 100%;
  height: 3.5rem;
  padding: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.primary};
`;

export const StyledText = styled.div<{ theme: ThemeProps } & ButtonProps>`
  margin-right: ${props => props.loading ? '1rem' : 0};
  transition: opacity 0.3s ease-out;
  opacity: ${props => props.loading ? 0.2 : 1};
`;