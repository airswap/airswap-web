import React, { FC, ReactElement } from 'react';
import { StyledDarkModeSwitch, StyledSideBar, StyledWallet } from './SideBar.styles';
import Navigation from '../Navigation/Navigation';

export type SideBarProps = {
  open: boolean;
}

const SideBar: FC<SideBarProps> = ({ open }): ReactElement => {

  return (
    <StyledSideBar open={open}>
      <StyledWallet />
      <Navigation />
      <StyledDarkModeSwitch />
    </StyledSideBar>
  );
}

export default SideBar;
