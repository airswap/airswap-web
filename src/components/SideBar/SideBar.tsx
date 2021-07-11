import React, { FC, ReactElement } from 'react';
import { StyledSideBar } from './SideBar.styles';
import Navigation from '../Navigation/Navigation';
import { Wallet } from '../../features/wallet/Wallet';

export type SideBarProps = {
  open: boolean;
}

const SideBar: FC<SideBarProps> = ({ open }): ReactElement => {

  return (
    <StyledSideBar open={open}>
      <Wallet />
      <Navigation />
    </StyledSideBar>
  );
}

export default SideBar;
