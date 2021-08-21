import { Suspense } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import { ThemeProvider } from "styled-components/macro";

import { useAppSelector } from "./app/hooks";
import Page from "./components/Page/Page";
import PageLoader from "./components/PageLoader/PageLoader";
import { selectUserSettings } from "./features/userSettings/userSettingsSlice";
import "./i18n/i18n";
import GlobalStyle from "./style/GlobalStyle";
import { darkTheme, lightTheme } from "./style/themes";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const App = (): JSX.Element => {
  const { theme } = useAppSelector(selectUserSettings);

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        {/* Suspense needed here for loading i18n resources */}
        <Suspense fallback={<PageLoader />}>
          <Router>
            <Route path="/:section([^0/#?]+)?">
              <Page />
            </Route>
          </Router>
        </Suspense>
      </Web3ReactProvider>
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default App;
