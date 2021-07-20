import React, { FC, ReactElement } from 'react';
import { StyledDarkModeSwitch, StyledSideBar, StyledWallet } from './SideBar.styles';
import Navigation from '../Navigation/Navigation';
import { toggleTheme } from '../../features/userSettings/userSettingsSlice';
import { useAppDispatch } from '../../app/hooks';

export type SideBarProps = {
  open: boolean;
}

const SideBar: FC<SideBarProps> = ({ open }): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <StyledSideBar open={open}>
      <StyledWallet />
      <Navigation />
      <StyledDarkModeSwitch
        onClick={() => { dispatch(toggleTheme()) }}
      />
    </StyledSideBar>
  );
}

export default SideBar;
