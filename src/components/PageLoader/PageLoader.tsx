// FIXME: remove after sidebar re-added

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement } from "react";

import { useAppSelector } from "../../app/hooks";
import { selectUserSettings } from "../../features/userSettings/userSettingsSlice";
import useWindowSize from "../../helpers/useWindowSize";
import { StyledPage, StyledSiteLogo } from "../Page/Page.styles";
import { StyledDarkModeSwitch, StyledSideBar } from "../SideBar/SideBar.styles";
import TradeContainer from "../TradeContainer/TradeContainer";

const PageLoader: FC = (): ReactElement => {
  const sideBarIsOpen = window.location.pathname.indexOf("swap") !== -1;
  const { showBookmarkWarning } = useAppSelector(selectUserSettings);
  const { width } = useWindowSize();
  /* using 480 from breakpoint size defined at src/style/breakpoints.ts */
  const adjustForBookmarkWarning = width! > 800 && showBookmarkWarning;

  return (
    <StyledPage adjustForBookmarkWarning={adjustForBookmarkWarning}>
      <StyledSiteLogo adjustForBookmarkWarning={adjustForBookmarkWarning} />
      <TradeContainer isOpen={true} />
      {/* <StyledSideBar isOpen={sideBarIsOpen} /> */}
      {/* <StyledDarkModeSwitch /> */}
    </StyledPage>
  );
};

export default PageLoader;
