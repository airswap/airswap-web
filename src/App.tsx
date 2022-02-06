import { Suspense } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import BigNumber from "bignumber.js";
import { ThemeProvider, ThemeType } from "styled-components/macro";

import { useAppSelector } from "./app/hooks";
import Page from "./components/Page/Page";
import PageLoader from "./components/PageLoader/PageLoader";
import Whitepaper from "./components/Whitepaper/Whitepaper";
import LastLookProvider from "./contexts/lastLook/LastLook";
import { selectTheme } from "./features/userSettings/userSettingsSlice";
import useSystemTheme from "./hooks/useSystemTheme";
import "./i18n/i18n";
import GlobalStyle from "./style/GlobalStyle";
import { darkTheme, lightTheme } from "./style/themes";

let cachedLibrary: Record<string, Web3Provider> = {};

function getLibrary(provider: any): Web3Provider {
  if (!cachedLibrary[provider.chainId]) {
    cachedLibrary[provider.chainId] = new Web3Provider(provider);
    cachedLibrary[provider.chainId].pollingInterval = 12000;
  }
  return cachedLibrary[provider.chainId];
}
//1e+9 is the highest possible number
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const App = (): JSX.Element => {
  const theme = useAppSelector(selectTheme);
  const systemTheme = useSystemTheme();
  const renderedTheme: ThemeType =
    theme === "system" ? systemTheme : (theme as ThemeType);

  return (
    <Router>
      <Switch>
        <Route exact path="/whitepaper">
          <Whitepaper />
        </Route>

        <Route path="/:tokenFrom?/:tokenTo?">
          <ThemeProvider
            theme={renderedTheme === "dark" ? darkTheme : lightTheme}
          >
            <Web3ReactProvider getLibrary={getLibrary}>
              {/* Suspense needed here for loading i18n resources */}
              <Suspense fallback={<PageLoader />}>
                <LastLookProvider>
                  <Page />
                </LastLookProvider>
              </Suspense>
            </Web3ReactProvider>
            <GlobalStyle />
          </ThemeProvider>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
