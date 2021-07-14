import React, { FC, ReactElement } from 'react';
import { StyledSideBar } from './SideBar.styles';
import Navigation from '../Navigation/Navigation';
import DarkModeSwitch, { ThemeType } from '../DarkModeSwitch/DarkModeSwitch';
import { Wallet } from '../../features/wallet/Wallet';

export type SideBarProps = {
  open: boolean;
  onChangeTheme: (theme: ThemeType) => void;
}

const SideBar: FC<SideBarProps> = ({ open, onChangeTheme }): ReactElement => {

  return (
    <StyledSideBar open={open}>
      <Wallet className="wallet" />
      <Navigation />
      <DarkModeSwitch
        className="dark-mode-switch"
        onClick={onChangeTheme}
      />
    </StyledSideBar>
  );
}

export default SideBar;
