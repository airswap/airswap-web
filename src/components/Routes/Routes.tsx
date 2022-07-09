import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";

import MakePage from "../../pages/Make/Make";
import MySwapsPage from "../../pages/MyOrders/MySwaps";
import OrderDetail from "../../pages/OrderDetail/OrderDetail";
import SwapPage from "../../pages/Swap/Swap";
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
        path={[`/${AppRoutes.myOrders}`, `/:lang/${AppRoutes.myOrders}`]}
        component={MySwapsPage}
        key="my-swaps"
      />
      <Route
        path={[`/${AppRoutes.order}`, `/:lang/${AppRoutes.order}`]}
        component={OrderDetail}
        key="order-detail"
      />
      <Route path="/*" component={SwapPage} key="swap" />
    </Switch>
  );
};

export default Routes;
