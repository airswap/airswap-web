// FIXME: remove after sidebar re-added

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Orders } from "../../features/orders/Orders";
import {
  selectUserSettings,
  toggleTheme,
} from "../../features/userSettings/userSettingsSlice";
import useWindowSize from "../../helpers/useWindowSize";
import SideBar from "../SideBar/SideBar";
import { StyledDarkModeSwitch, StyledWallet } from "../SideBar/SideBar.styles";
import Toaster from "../Toasts/Toaster";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { StyledPage, StyledSiteLogo } from "./Page.styles";

export type StyledPageProps = {
  /**
   * if set, take off the space needed for the bookmarkwarning from the min-height and height of StyledPage
   */
  adjustForBookmarkWarning: boolean;
};

const Page: FC = (): ReactElement => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
  const { showBookmarkWarning } = useAppSelector(selectUserSettings);
  const { width } = useWindowSize();
  const dispatch = useAppDispatch();
  /* using 480 from breakpoint size defined at src/style/breakpoints.ts */
  const adjustForBookmarkWarning = width! > 480 && showBookmarkWarning;

  return (
    <StyledPage adjustForBookmarkWarning={adjustForBookmarkWarning}>
      <Toaster sideBarOpen={sideBarOpen} />
      <StyledSiteLogo adjustForBookmarkWarning={adjustForBookmarkWarning} />
      <StyledWallet isOpen={sideBarOpen} />
      <WidgetFrame isOpen={sideBarOpen}>
        <Orders />
      </WidgetFrame>
      {/* <SideBar
        isOpen={sideBarOpen}
        setIsOpen={() => {
          setSideBarOpen(!sideBarOpen);
        }}
      />*/}
      {/*
       <StyledDarkModeSwitch
        onClick={() => {
          dispatch(toggleTheme());
        }}
      />*/}
    </StyledPage>
  );
};

export default Page;
