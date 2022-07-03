import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";

import MakePage from "../../pages/Make/Make";
import MySwapsPage from "../../pages/MySwaps/MySwaps";
import SwapPage from "../../pages/Swap/Swap";
import SwapDetailPage from "../../pages/SwapDetail/SwapDetail";
import { AppRoutes } from "../../routes";

const Routes: FC = () => {
  return (
    <Switch>
      <Route
        path={[`/${AppRoutes.make}`, `/:lang/${AppRoutes.make}`]}
        component={MakePage}
        key="make"
      />
      <Route
        path={[`/${AppRoutes.mySwaps}`, `/:lang/${AppRoutes.mySwaps}`]}
        component={MySwapsPage}
        key="my-swaps"
      />
      <Route
        path={[`/${AppRoutes.swapId}`, `/:lang/${AppRoutes.swapId}`]}
        component={SwapDetailPage}
        key="swap-detail"
      />
      <Route path="/*" component={SwapPage} key="swap" />
    </Switch>
  );
};

export default Routes;
