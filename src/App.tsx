import { Suspense } from "react";
import { ThemeProvider } from 'styled-components/macro';
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Orders } from "./features/orders/Orders";
import { Transactions } from "./features/transactions/Transactions";
import Balances from "./features/balances/Balances";
import GlobalStyle from './style/GlobalStyle';
import TradeContainer from './components/TradeContainer/TradeContainer';
import Page from './components/Page/Page';
import Title from './components/Title/Title';
import { useAppSelector } from './app/hooks';
import { selectUserSettings } from './features/userSettings/userSettingsSlice';
import { darkTheme, lightTheme, ThemeType } from './style/themes';
import "./i18n/i18n";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const App = (): JSX.Element => {
  const { theme } = useAppSelector(selectUserSettings);

  return (
    <ThemeProvider theme={theme === ThemeType.dark ? darkTheme : lightTheme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        {/* Suspense needed here for loading i18n resources */}
        <Suspense fallback={"Loading..."}>
          <Page>
            <TradeContainer>
              <Title type="h4">Swap now</Title>
              <Orders />
              <Transactions />
              ☠️ Use at your own risk
              <Balances />
            </TradeContainer>
          </Page>
        </Suspense>
      </Web3ReactProvider>
      <GlobalStyle />
    </ThemeProvider>
  );
}

export default App;
