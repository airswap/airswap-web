import React, { FC, ReactElement } from 'react';
import { StyledPage } from './Page.styles';
import SideBar from '../SideBar/SideBar';
import SiteLogo from '../SiteLogo/SiteLogo';

const Page: FC = ({ children }): ReactElement => {

  return (
    <StyledPage>
      <SiteLogo className="site-logo" />
      <SideBar open />
      { children }
    </StyledPage>
  )
};

export default Page;
