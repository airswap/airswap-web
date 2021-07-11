import React, { FC, ReactElement } from 'react';
import { StyledPage, StyledSiteLogo } from './Page.styles';
import { ThemeType } from '../DarkModeSwitch/DarkModeSwitch';
import SideBar from '../SideBar/SideBar';

export type PageProps = {
  onChangeTheme: (theme: ThemeType) => void;
}

const Page: FC<PageProps> = ({ children, onChangeTheme }): ReactElement => {

  return (
    <StyledPage>
      <StyledSiteLogo />
      <SideBar onChangeTheme={onChangeTheme} open />
      { children }
    </StyledPage>
  )
};

export default Page;
