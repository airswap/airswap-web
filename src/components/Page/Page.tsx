// FIXME: remove after sidebar re-added

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactElement } from "react";
import { useState } from "react";

import { useAppDispatch } from "../../app/hooks";
import { Orders } from "../../features/orders/Orders";
import { toggleTheme } from "../../features/userSettings/userSettingsSlice";
import SideBar from "../SideBar/SideBar";
import { StyledWallet, StyledDarkModeSwitch } from "../SideBar/SideBar.styles";
import Toaster from "../Toasts/Toaster";
import WidgetFrame from "../WidgetFrame/WidgetFrame";
import { StyledPage, StyledSiteLogo } from "./Page.styles";

const Page: FC = (): ReactElement => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  return (
    <StyledPage>
      <Toaster sideBarOpen={sideBarOpen} />
      <StyledSiteLogo />
      <StyledWallet isOpen={sideBarOpen} />
      <WidgetFrame isOpen={sideBarOpen}>
        <Orders />
      </WidgetFrame>
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
