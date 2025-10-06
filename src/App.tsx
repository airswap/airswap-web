import React, { Suspense } from "react";
import { HashRouter as Router } from "react-router-dom";

import { Web3ReactProvider } from "@web3-react/core";

import BigNumber from "bignumber.js";
import { ThemeProvider, ThemeType } from "styled-components/macro";

import { useAppSelector } from "./app/hooks";
import HelmetContainer from "./components/HelmetContainer/HelmetContainer";
import PageLoader from "./components/PageLoader/PageLoader";
import Routes from "./components/Routes/Routes";
import InterfaceProvider from "./contexts/interface/Interface";
import { selectTheme } from "./features/userSettings/userSettingsSlice";
import useCustomServer from "./hooks/useCustomServer";
import useSystemTheme from "./hooks/useSystemTheme";
import "./i18n/i18n";
import "./sentry";
import GlobalStyle from "./style/GlobalStyle";
import { darkTheme, lightTheme } from "./style/themes";
import { prioritizedConnectors } from "./web3-connectors/connections";

// 1e+9 is the highest possible number
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const App = (): JSX.Element => {
  const theme = useAppSelector(selectTheme);
  const systemTheme = useSystemTheme();

  const renderedTheme: ThemeType =
    theme === "system" ? systemTheme : (theme as ThemeType);

  useCustomServer();

  return (
    <>
      <HelmetContainer
        title={
          "AirSwap: Peer-to-peer Token Trading DEX and Open Source Developer DAO"
        }
      />

      <Router>
        <ThemeProvider
          theme={renderedTheme === "dark" ? darkTheme : lightTheme}
        >
          <Web3ReactProvider
            connectors={Object.values(prioritizedConnectors).map(
              (connector) => [connector.connector, connector.hooks]
            )}
          >
            {/* Suspense needed here for loading i18n resources */}
            <Suspense fallback={<PageLoader />}>
              <InterfaceProvider>
                <Routes />
              </InterfaceProvider>
            </Suspense>
          </Web3ReactProvider>
          <GlobalStyle />
        </ThemeProvider>
      </Router>
    </>
  );
};

export default App;
