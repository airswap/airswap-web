import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";

import MakePage from "../../pages/Make/Make";
import MySwapsPage from "../../pages/MySwaps/MySwaps";
import SwapPage from "../../pages/Swap/Swap";

const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/make" component={MakePage} key="make" />
      <Route path="/my-swaps" component={MySwapsPage} key="my-swaps" />
      <Route path="/*" component={SwapPage} key="swap" />
    </Switch>
  );
};

export default Routes;
