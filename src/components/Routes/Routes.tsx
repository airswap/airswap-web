import React, { FC } from "react";
import { Route as ReactRouterDomRoute, Switch } from "react-router-dom";

import * as Sentry from "@sentry/react";

import useBalances from "../../features/balances/balancesHooks";
import { useDelegateRules } from "../../features/delegateRules/delegateRulesHooks";
import useMetadata from "../../features/metadata/metadataHooks";
import useMyOrders from "../../features/myOtcOrders/myOtcOrdersHooks";
import { useTransactions } from "../../features/transactions/transactionsHooks";
import useWeb3 from "../../features/web3/web3Hooks";
import Approvals from "../../pages/Approvals/Approvals";
import Cancel from "../../pages/Cancel/Cancel";
import LimitOrderDetail from "../../pages/LimitOrderDetail/LimitOrderDetail";
import MakePage from "../../pages/Make/Make";
import MyLimitOrdersPage from "../../pages/MyLimitOrders/MyLimitOrders";
import MyOtcOrdersPage from "../../pages/MyOtcOrders/MyOtcOrders";
import OtcOrderDetail from "../../pages/OtcOrderDetail/OtcOrderDetail";
import SwapPage from "../../pages/Swap/Swap";
import { AppRoutes } from "../../routes";

const Route = Sentry.withSentryRouting(ReactRouterDomRoute);

const Routes: FC = () => {
  useBalances();
  useMetadata();
  useTransactions();
  useDelegateRules();
  useMyOrders();
  useWeb3();

  return (
    <Switch>
      <Route
        path={`/${AppRoutes.makeOtcOrder}`}
        component={MakePage}
        key="make-otc-order"
      />
      <Route
        path={`/${AppRoutes.makeLimitOrder}`}
        render={() => <MakePage isLimitOrder={true} />}
        key="make-limit-order"
      />
      <Route
        path={`/${AppRoutes.myOtcOrders}`}
        component={MyOtcOrdersPage}
        key="my-otc-orders"
      />
      <Route
        path={`/${AppRoutes.myLimitOrders}`}
        component={MyLimitOrdersPage}
        key="my-limit-orders"
      />
      <Route
        exact
        path={`/${AppRoutes.otcOrder}/:compressedOrder`}
        component={OtcOrderDetail}
        key="otc-order-detail"
      />
      <Route
        exact
        path={`/${AppRoutes.limitOrder}/:senderWallet/:senderToken/:signerToken/:chainId`}
        component={LimitOrderDetail}
        key="limit-order-detail"
      />
      <Route
        path={`/${AppRoutes.otcOrder}/:compressedOrder/cancel`}
        component={Cancel}
        key="cancel"
      />
      <Route
        path={`/${AppRoutes.approvals}`}
        component={Approvals}
        key="approvals"
      />
      <Route path="/*" component={SwapPage} key="swap" />
    </Switch>
  );
};

export default Routes;
