import React, { FC, ReactElement } from 'react';
import { StyledDarkModeSwitch, StyledSideBar, StyledWallet } from './SideBar.styles';
import Navigation from '../Navigation/Navigation';
import { ThemeType } from '../DarkModeSwitch/DarkModeSwitch';

export type SideBarProps = {
  open: boolean;
  onChangeTheme: (theme: ThemeType) => void;
}

const SideBar: FC<SideBarProps> = ({ open, onChangeTheme }): ReactElement => {

  return (
    <StyledSideBar open={open}>
      <StyledWallet />
      <Navigation />
      <StyledDarkModeSwitch onClick={onChangeTheme} />
    </StyledSideBar>
  );
}

export default SideBar;
