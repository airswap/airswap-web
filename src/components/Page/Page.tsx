import React, { FC, ReactElement } from "react";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { useAppDispatch } from "../../app/hooks";
import { Orders } from "../../features/orders/Orders";
import { toggleTheme } from "../../features/userSettings/userSettingsSlice";
import SideBar from "../SideBar/SideBar";
import { StyledWallet, StyledDarkModeSwitch } from "../SideBar/SideBar.styles";
import Toaster from "../Toasts/Toaster";
import TradeContainer from "../TradeContainer/TradeContainer";
import { StyledPage, StyledSiteLogo } from "./Page.styles";

const Page: FC = (): ReactElement => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const match = useRouteMatch<{
    tokenFrom?: string;
    tokenTo?: string;
  }>();

  const { tokenFrom, tokenTo } = match.params;
  console.log(tokenFrom, tokenTo);

  return (
    <StyledPage>
      <Toaster sideBarOpen={sideBarOpen} />
      <StyledSiteLogo />
      <StyledWallet isOpen={sideBarOpen} />
      <TradeContainer isOpen={sideBarOpen}>
        <Orders />
      </TradeContainer>
      <SideBar
        isOpen={sideBarOpen}
        setIsOpen={() => {
          setSideBarOpen(!sideBarOpen);
        }}
      />
      <StyledDarkModeSwitch
        onClick={() => {
          dispatch(toggleTheme());
        }}
      />
    </StyledPage>
  );
};

export default Page;
