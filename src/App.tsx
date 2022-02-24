import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import BigNumber from "bignumber.js";

import HelmetContainer from "./components/HelmetContainer/HelmetContainer";
import "./i18n/i18n";
import Home from "./pages/Home/Home";

// 1e+9 is the highest possible number
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const App = (): JSX.Element => {
  return (
    <>
      <HelmetContainer
        title={
          "AirSwap: Peer-to-peer Token Trading DEX and Open Source Developer DAO"
        }
      />

      <Router>
        <Switch>
          <Route>
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
