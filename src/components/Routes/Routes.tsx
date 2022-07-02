import React, { FC } from "react";
import { Route } from "react-router-dom";

import CreateOtcPage from "../../pages/CreateOtc/CreateOtc";
import SwapPage from "../../pages/Swap/Swap";

const Routes: FC = () => {
  return (
    <>
      <Route
        path="/create-swap"
        render={() => <CreateOtcPage />}
        key="create-otc"
      />

      <Route path="/*" render={() => <SwapPage />} key="swap" />
    </>
  );
};

export default Routes;
