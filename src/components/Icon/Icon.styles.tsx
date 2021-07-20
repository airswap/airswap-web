import styled from 'styled-components/macro';
import { ThemeProps } from '../../style/themes';

interface StyledIconProps {
  iconSize: number;
}

export const StyledIcon = styled.div<{ theme: ThemeProps } & StyledIconProps>`  
  svg {
    width: ${props => `${props.iconSize}rem`};
  }

  circle,
  path,
  polygon,
  rect {
   fill: ${props => props.color || 'currentColor'};
  }
  
  .stroke {
    fill: none;
    stroke: ${props => props.color || 'currentColor'};
  }
`;
