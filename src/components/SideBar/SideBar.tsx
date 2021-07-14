import React, { FC, ReactElement } from 'react';
import { StyledSideBar } from './SideBar.styles';
import Navigation from '../Navigation/Navigation';
import DarkModeSwitch from '../DarkModeSwitch/DarkModeSwitch';
import { Wallet } from '../../features/wallet/Wallet';
import { toggleTheme } from '../../features/userSettings/userSettingsSlice';
import { useAppDispatch } from '../../app/hooks';

export type SideBarProps = {
  open: boolean;
}

const SideBar: FC<SideBarProps> = ({ open }): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <StyledSideBar open={open}>
      <Wallet className="wallet" />
      <Navigation />
      <DarkModeSwitch
        className="dark-mode-switch"
        onClick={() => { dispatch(toggleTheme()) }}
      />
    </StyledSideBar>
  );
}

export default SideBar;
