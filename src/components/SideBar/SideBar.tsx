import React, { FC, ReactElement } from "react";

import { useAppDispatch } from "../../app/hooks";
import { toggleTheme } from "../../features/userSettings/userSettingsSlice";
import Navigation from "../Navigation/Navigation";
import {
  StyledDarkModeSwitch,
  StyledSideBar,
  StyledWallet,
} from "./SideBar.styles";

export type SideBarProps = {
  open: boolean;
};

const SideBar: FC<SideBarProps> = ({ open }): ReactElement => {
  const dispatch = useAppDispatch();

  return (
    <StyledSideBar open={open}>
      <StyledWallet />
      <Navigation />
      <StyledDarkModeSwitch
        onClick={() => {
          dispatch(toggleTheme());
        }}
      />
    </StyledSideBar>
  );
};

export default SideBar;
