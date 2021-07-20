import React, { FC, ReactElement } from 'react';
import { StyledPage, StyledSiteLogo } from './Page.styles';
import SideBar from '../SideBar/SideBar';

const Page: FC = ({ children }): ReactElement => {

  return (
    <StyledPage>
      <StyledSiteLogo />
      <SideBar open />
      { children }
    </StyledPage>
  )
};

export default Page;
