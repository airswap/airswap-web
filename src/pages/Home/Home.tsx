import React, { Suspense } from "react";
import { LastLocationProvider } from "react-router-last-location";

import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";

import { ThemeProvider, ThemeType } from "styled-components/macro";

import { useAppSelector } from "../../app/hooks";
import Page from "../../components/Page/Page";
import PageLoader from "../../components/PageLoader/PageLoader";
import LastLookProvider from "../../contexts/lastLook/LastLook";
import { selectTheme } from "../../features/userSettings/userSettingsSlice";
import useSystemTheme from "../../hooks/useSystemTheme";
import GlobalStyle from "../../style/GlobalStyle";
import { darkTheme, lightTheme } from "../../style/themes";

let cachedLibrary: Record<string, Web3Provider> = {};

function getLibrary(provider: any): Web3Provider {
  if (!cachedLibrary[provider.chainId]) {
    cachedLibrary[provider.chainId] = new Web3Provider(provider);
    cachedLibrary[provider.chainId].pollingInterval = 12000;
  }
  return cachedLibrary[provider.chainId];
}

const Home = (): JSX.Element => {
  const theme = useAppSelector(selectTheme);
  const systemTheme = useSystemTheme();
  const renderedTheme: ThemeType =
    theme === "system" ? systemTheme : (theme as ThemeType);

  return (
    <ThemeProvider theme={renderedTheme === "dark" ? darkTheme : lightTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        {/* Suspense needed here for loading i18n resources */}
        <Suspense fallback={<PageLoader />}>
          <LastLookProvider>
            <LastLocationProvider>
              <Page />
            </LastLocationProvider>
          </LastLookProvider>
        </Suspense>
      </Web3ReactProvider>
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default Home;
