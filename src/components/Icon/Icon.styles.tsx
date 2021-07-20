import styled from 'styled-components/macro';
import { ThemeProps } from '../../style/themes';
import { SvgIconProps } from './Icon';

export const StyledIcon = styled.span<{ theme: ThemeProps & SvgIconProps }>`
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
