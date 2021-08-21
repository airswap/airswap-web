import React, { FC, ReactElement } from "react";

import { StyledPage, StyledSiteLogo } from "../Page/Page.styles";
import { StyledDarkModeSwitch, StyledSideBar } from "../SideBar/SideBar.styles";
import TradeContainer from "../TradeContainer/TradeContainer";

const PageLoader: FC = (): ReactElement => {
  const sideBarIsOpen = window.location.pathname.indexOf("swap") !== -1;

  return (
    <StyledPage>
      <StyledSiteLogo />
      <TradeContainer isOpen={sideBarIsOpen} />
      <StyledSideBar isOpen={sideBarIsOpen} />
      <StyledDarkModeSwitch />
    </StyledPage>
  );
};

export default PageLoader;
