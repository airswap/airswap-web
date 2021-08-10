import React, { FC, ReactElement } from "react";

import { routes } from "../../routes";
import {
  NavigationButton,
  NavigationButtonIcon,
  StyledNavigation,
} from "./Navigation.styles";

const anchors = routes.filter((route) => route.path !== "/");

const Navigation: FC = (): ReactElement => {
  return (
    <StyledNavigation>
      {anchors.map((route) => (
        <NavigationButton href={route.path}>
          <NavigationButtonIcon iconSize={1} name="arrow-right" />
          {route.label}
        </NavigationButton>
      ))}
    </StyledNavigation>
  );
};

export default Navigation;
