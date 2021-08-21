import React, { FC, ReactElement, useEffect } from "react";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { useAppDispatch } from "../../app/hooks";
import { Orders } from "../../features/orders/Orders";
import { toggleTheme } from "../../features/userSettings/userSettingsSlice";
import { NavLocation } from "../../routes";
import SideBar from "../SideBar/SideBar";
import { StyledWallet, StyledDarkModeSwitch } from "../SideBar/SideBar.styles";
import TradeContainer from "../TradeContainer/TradeContainer";
import { StyledPage, StyledSiteLogo } from "./Page.styles";

const Page: FC = (): ReactElement => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const history = useHistory();

  const match = useRouteMatch<{
    senderToken?: string;
    signerToken?: string;
    section?: NavLocation;
  }>();

  const { section } = match.params;

  useEffect(() => {
    setSideBarOpen(section === "swap");
  }, [section]);

  return (
    <StyledPage>
      <StyledSiteLogo />
      <StyledWallet isOpen={sideBarOpen} />
      <TradeContainer isOpen={sideBarOpen}>
        <Orders />
      </TradeContainer>
      <SideBar
        isOpen={sideBarOpen}
        setIsOpen={() => {
          setSideBarOpen(!sideBarOpen);
          sideBarOpen ? history.push("/introduction") : history.push("/swap");
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
