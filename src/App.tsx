import React, { Suspense } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Orders } from "./features/orders/Orders";
import { Wallet } from "./features/wallet/Wallet";
import { Transactions } from "./features/transactions/Transactions";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Balances from "./features/balances/Balances";
import "./App.css";
import "./i18n/i18n";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {/* Suspense needed here for loading i18n resources */}
      <Suspense fallback={"Loading..."}>
        <Router>
          <div className="App">
            <Route path="/:senderToken?/:signerToken?">
              <Wallet />
              <Orders />
              <Transactions />
              ☠️ Use at your own risk
              <Balances />
            </Route>
          </div>
        </Router>
      </Suspense>
    </Web3ReactProvider>
  );
}

export default App;
