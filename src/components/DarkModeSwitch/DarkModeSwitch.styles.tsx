import styled from 'styled-components/macro';
import { ThemeProps } from '../../style/themes';
import IconButton from '../IconButton/IconButton';

export const StyledDarkModeSwitch = styled(IconButton)<{ theme: ThemeProps }>`
  width: 1.5rem;
  height: 1.5rem;
  
  &:hover {
    opacity: 0.5;
  }
`;
