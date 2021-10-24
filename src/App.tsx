import { Suspense } from "react";
import { HashRouter as Router, Route } from "react-router-dom";

import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import { ThemeProvider } from "styled-components/macro";
import { ModalProvider } from "styled-react-modal";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import BookmarkWarning from "./components/BookmarkWarning/BookmarkWarning";
import Page from "./components/Page/Page";
import PageLoader from "./components/PageLoader/PageLoader";
import LastLookProvider from "./contexts/lastLook/LastLook";
import {
  disableBookmarkWarning,
  selectUserSettings,
} from "./features/userSettings/userSettingsSlice";
import useWindowSize from "./helpers/useWindowSize";
import "./i18n/i18n";
import GlobalStyle from "./style/GlobalStyle";
import { darkTheme, lightTheme } from "./style/themes";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const App = (): JSX.Element => {
  const { theme, showBookmarkWarning } = useAppSelector(selectUserSettings);
  const { width } = useWindowSize();
  const dispatch = useAppDispatch();
  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <LastLookProvider>
          <ModalProvider>
            {/* Suspense needed here for loading i18n resources */}
            <Suspense fallback={<PageLoader />}>
              <BookmarkWarning
                hidden={width! < 480 || !showBookmarkWarning}
                onClick={() => dispatch(disableBookmarkWarning())}
              />
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
