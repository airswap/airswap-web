import { Suspense } from "react";
import { HashRouter as Router, Route } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import BigNumber from "bignumber.js";
import { ThemeProvider } from "styled-components/macro";
import { ModalProvider } from "styled-react-modal";

import { useAppSelector } from "./app/hooks";
import Page from "./components/Page/Page";
import PageLoader from "./components/PageLoader/PageLoader";
import LastLookProvider from "./contexts/lastLook/LastLook";
import { selectUserSettings } from "./features/userSettings/userSettingsSlice";
import "./i18n/i18n";
import GlobalStyle from "./style/GlobalStyle";
import { darkTheme, lightTheme } from "./style/themes";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}
//1e+9 is the highest possible number
BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const App = (): JSX.Element => {
  const { theme } = useAppSelector(selectUserSettings);
  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <LastLookProvider>
          <ModalProvider>
            {/* Suspense needed here for loading i18n resources */}
            <Suspense fallback={<PageLoader />}>
              <Router>
                <Route path="/:tokenFrom?/:tokenTo?">
                  <Page />
                </Route>
              </Router>
            </Suspense>
          </ModalProvider>
        </LastLookProvider>
      </Web3ReactProvider>
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default App;
