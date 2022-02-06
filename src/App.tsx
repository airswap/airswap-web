import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import BigNumber from "bignumber.js";

import "./i18n/i18n";
import Home from "./pages/Home/Home";
import Whitepaper from "./pages/Whitepaper/Whitepaper";
import { AppRoutes } from "./routes";

// 1e+9 is the highest possible number
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const App = (): JSX.Element => {
  return (
    <Router>
      <Switch>
        <Route exact path={AppRoutes.whitepaper}>
          <Whitepaper />
        </Route>

        <Route exact path={AppRoutes.swap}>
          <Home />
        </Route>

        <Route>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
