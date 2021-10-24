import React, { FC } from "react";

import {
  IconAirswap,
  ToolbarButtonsContainer,
  ToolbarContainer,
} from "./Toolbar.styles";
import ToolbarButton from "./subcomponents/ToolbarButton/ToolbarButton";

const Toolbar: FC = () => {
  return (
    <ToolbarContainer>
      <IconAirswap iconSize={2.5} name="airswap" />
      <ToolbarButtonsContainer>
        <ToolbarButton text="stats" iconName="bars" />
        <ToolbarButton text="vote" iconName="vote" />
        <ToolbarButton text="code" iconName="code" />
        <ToolbarButton text="about" iconName="about" />
        <ToolbarButton text="join" iconName="contact-support" />
      </ToolbarButtonsContainer>
    </ToolbarContainer>
  );
};

export default Toolbar;
