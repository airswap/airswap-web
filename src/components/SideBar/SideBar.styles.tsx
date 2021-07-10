import styled from 'styled-components';
import { ThemeProps } from '../../style/themes';
import { SideBarProps } from './SideBar';
import breakPoints from '../../style/breakpoints';

export const StyledSideBar = styled.nav<{ theme: ThemeProps } & SideBarProps>`
  transition: transform 0.5s ease-out;
  transform: ${props => props.open ? 'none' : 'translateX(30vw)'} ;

  position: absolute;
  top: 0;
  right: 0;
  border-left: 1px solid ${props => props.theme.colors.grey};
  width: 40vw;
  min-width: 29rem;
  max-width: 32.25rem;
  height: 100%;
  min-height: 100vh;
  padding: 3.25rem 1.5rem;
  background: ${props => props.theme.colors.darkGrey};
  
  @media ${breakPoints.desktopUp} {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
`;
