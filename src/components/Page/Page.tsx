// FIXME: remove after sidebar re-added

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Orders } from "../../features/orders/Orders";
import { selectUserSettings } from "../../features/userSettings/userSettingsSlice";
import { StyledWallet } from "../SideBar/SideBar.styles";
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
  const dispatch = useAppDispatch();

  return (
    <StyledPage adjustForBookmarkWarning={showBookmarkWarning}>
      <Toaster sideBarOpen={sideBarOpen} />
      <StyledSiteLogo />
      <StyledWallet isOpen={sideBarOpen} />
      <TradeContainer isOpen={sideBarOpen}>
        <Orders />
      </TradeContainer>
      {/* <SideBar
        isOpen={sideBarOpen}
        setIsOpen={() => {
          setSideBarOpen(!sideBarOpen);
        }}
      /> */}
      {/* <StyledDarkModeSwitch
        onClick={() => {
          dispatch(toggleTheme());
        }}
      /> */}
    </StyledPage>
  );
};

export default Page;
