import React, { FC, ReactElement, useState } from 'react';
import { StyledPage, StyledSiteLogo } from './Page.styles';
import SideBar from '../SideBar/SideBar';

const Page: FC = ({ children }): ReactElement => {
  const [sideMenuIsOpen, setSideMenuIsOpen] = useState(false);

  return (
    <StyledPage>
      <StyledSiteLogo />
      <SideBar open />
      { children }
    </StyledPage>
  )
};

export default Page;
