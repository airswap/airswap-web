import React, { Suspense } from "react";
import { HashRouter as Router } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import * as Sentry from "@sentry/react";
import { Web3ReactProvider } from "@web3-react/core";

import BigNumber from "bignumber.js";
import { ThemeProvider, ThemeType } from "styled-components/macro";

import { useAppSelector } from "./app/hooks";
import HelmetContainer from "./components/HelmetContainer/HelmetContainer";
import PageLoader from "./components/PageLoader/PageLoader";
import Routes from "./components/Routes/Routes";
import InterfaceProvider from "./contexts/interface/Interface";
import LastLookProvider from "./contexts/lastLook/LastLook";
import { selectTheme } from "./features/userSettings/userSettingsSlice";
import useCustomServer from "./hooks/useCustomServer";
import useSystemTheme from "./hooks/useSystemTheme";
import "./i18n/i18n";
import GlobalStyle from "./style/GlobalStyle";
import { darkTheme, lightTheme } from "./style/themes";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", "airswap.io", "airswap.eth.limo"],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// 1e+9 is the highest possible number
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

let cachedLibrary: Record<string, Web3Provider> = {};

function getLibrary(provider: any): Web3Provider {
  if (!cachedLibrary[provider.chainId]) {
    cachedLibrary[provider.chainId] = new Web3Provider(provider);
    cachedLibrary[provider.chainId].pollingInterval = 12000;
  }
  return cachedLibrary[provider.chainId];
}

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
          <Web3ReactProvider getLibrary={getLibrary}>
            {/* Suspense needed here for loading i18n resources */}
            <Suspense fallback={<PageLoader />}>
              <LastLookProvider>
                <InterfaceProvider>
                  <Routes />
                </InterfaceProvider>
              </LastLookProvider>
            </Suspense>
          </Web3ReactProvider>
          <GlobalStyle />
        </ThemeProvider>
      </Router>
    </>
  );
};

export default App;
