import React, { FC, ReactElement } from 'react';
import { StyledSideBar } from './SideBar.styles';
import Navigation from '../Navigation/Navigation';

export type SideBarProps = {
  open: boolean;
}

const SideBar: FC<SideBarProps> = ({ open }): ReactElement => {

  return (
    <StyledSideBar open={open}>
      <Navigation />
    </StyledSideBar>
  );
}

export default SideBar;
