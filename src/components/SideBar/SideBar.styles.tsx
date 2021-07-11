import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';
import { SideBarProps } from './SideBar';
import IconButton from '../IconButton/IconButton';
import { Wallet } from '../../features/wallet/Wallet';
import DarkModeSwitch from '../DarkModeSwitch/DarkModeSwitch';
import breakPoints from '../../style/breakpoints';

export const StyledSideBar = styled.div<{ theme: ThemeProps } & SideBarProps>`
  transition: transform 0.5s ease-out;
  transform: ${props => props.open ? 'none' : 'translateX(27rem)'} ;
  
  display: none;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  border-left: 1px solid ${props => props.theme.colors.grey};
  width: 27rem;
  height: 100%;
  min-height: 100vh;
  padding: 3.25rem 0;
  background: ${props => props.theme.colors.darkGrey};
  
  @media ${breakPoints.tabletLandscapeUp} {
    display: flex;
  }  
`;

export const StyledToggleButton = styled(IconButton)<{ theme: ThemeProps }>`
  position: absolute;
  top: 50%;
  left: 0;
`;

export const StyledWallet = styled(Wallet)<{ theme: ThemeProps }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
`;

export const StyledDarkModeSwitch = styled(DarkModeSwitch)<{ theme: ThemeProps }>`
  position: absolute;
  bottom: 2.5rem;
  right: 2.5rem;
  width: 1.5rem;
  height: 1.5rem;
`;
