import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";

import useBalances from "../../features/balances/balancesHooks";
import useMetadata from "../../features/metadata/metadataHooks";
import useMyOrders from "../../features/myOrders/myOrdersHooks";
import { useTransactions } from "../../features/transactions/transactionsHooks";
import useWeb3 from "../../features/web3/web3Hooks";
import Cancel from "../../pages/Cancel/Cancel";
import MakePage from "../../pages/Make/Make";
import MySwapsPage from "../../pages/MyOrders/MyOrders";
import OrderDetail from "../../pages/OrderDetail/OrderDetail";
import SwapPage from "../../pages/Swap/Swap";
import { AppRoutes } from "../../routes";

const Routes: FC = () => {
  useBalances();
  useMetadata();
  useTransactions();
  useMyOrders();
  useWeb3();

  return (
    <Switch>
      <Route path={`/${AppRoutes.make}`} component={MakePage} key="make" />
      <Route
        path={`/${AppRoutes.myOrders}`}
        component={MySwapsPage}
        key="my-swaps"
      />
      <Route
        exact
        path={`/${AppRoutes.order}/:compressedOrder`}
        component={OrderDetail}
        key="order-detail"
      />
      <Route
        path={`/${AppRoutes.order}/:compressedOrder/cancel`}
        component={Cancel}
        key="cancel"
      />
      <Route path="/*" component={SwapPage} key="swap" />
    </Switch>
  );
};

export default Routes;
