import styled from 'styled-components/macro';
import { ThemeProps } from '../../style/themes';
import Icon from '../Icon/Icon';

interface StyledIconButtonProps {
  hasText: boolean;
}

export const StyledIcon = styled(Icon)<{ theme: ThemeProps }>`

`;

export const StyledIconButton = styled.button<{ theme: ThemeProps } & StyledIconButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 1rem;
  font-weight: 600;
  
  ${StyledIcon} {
    svg {
      margin-left: ${props => props.hasText ? '0.5rem' : 0};
    }
  }
`;
