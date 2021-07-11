import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';
import { SideBarProps } from './SideBar';
import IconButton from '../IconButton/IconButton';

export const StyledSideBar = styled.div<{ theme: ThemeProps } & SideBarProps>`
  transition: transform 0.5s ease-out;
  transform: ${props => props.open ? 'none' : 'translateX(30vw)'} ;
  
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  border-left: 1px solid ${props => props.theme.colors.grey};
  width: 40vw;
  min-width: 29rem;
  max-width: 32.25rem;
  height: 100%;
  min-height: 100vh;
  padding: 3.25rem 0;
  background: ${props => props.theme.colors.darkGrey};
`;

export const StyledToggleButton = styled(IconButton)<{ theme: ThemeProps }>`
  position: absolute;
  top: 50%;
  left: 0;
`;
