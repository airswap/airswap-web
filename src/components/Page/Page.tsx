import React, { FC, ReactElement } from 'react';
import { StyledPage } from './Page.styles';
import { ThemeType } from '../DarkModeSwitch/DarkModeSwitch';
import SideBar from '../SideBar/SideBar';
import SiteLogo from '../SiteLogo/SiteLogo';

export type PageProps = {
  onChangeTheme: (theme: ThemeType) => void;
}

const Page: FC<PageProps> = ({ children, onChangeTheme }): ReactElement => {

  return (
    <StyledPage>
      <SiteLogo className="site-logo" />
      <SideBar onChangeTheme={onChangeTheme} open />
      { children }
    </StyledPage>
  )
};

export default Page;
