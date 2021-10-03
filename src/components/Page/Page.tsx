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
import TradeContainer from "../TradeContainer/TradeContainer";
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
  const adjustForBookmarkWarning = width! > 800 && showBookmarkWarning;

  return (
    <StyledPage adjustForBookmarkWarning={adjustForBookmarkWarning}>
      <Toaster sideBarOpen={sideBarOpen} />
      <StyledSiteLogo adjustForBookmarkWarning={adjustForBookmarkWarning} />
      <StyledWallet isOpen={sideBarOpen} />
      <TradeContainer isOpen={sideBarOpen}>
        <Orders />
      </TradeContainer>
      {/*
       <SideBar
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
