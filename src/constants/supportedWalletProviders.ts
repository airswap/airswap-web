import detectEthereumProvider from "@metamask/detect-provider";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import metamaskLogo from "../assets/wallet-provider-logos/metamask.svg";
import walletconnectLogo from "../assets/wallet-provider-logos/walletconnect.svg";

export type WalletProviderName = "MetaMask" | "WalletConnect";

export type WalletProvider = {
  name: WalletProviderName;
  logo: string;
  isProviderInstalled: Promise<boolean>;
  url: string;
  getConnector: () => AbstractConnector;
};

const cachedConnectors: Record<string, AbstractConnector> = {};

const isWalletProviderInstalled = (
  name: WalletProviderName
): Promise<boolean> => {
  return new Promise(async (resolve) => {
    if (name === "MetaMask") {
      return detectEthereumProvider().then((value) => {
        resolve(!!value);
      });
    }

    return resolve(true);
  });
};

const SUPPORTED_WALLET_PROVIDERS: WalletProvider[] = [
  {
    name: "MetaMask",
    logo: metamaskLogo,
    isProviderInstalled: isWalletProviderInstalled("MetaMask"),
    url: "https://metamask.io/",
    getConnector: () => {
      if (!cachedConnectors.MetaMask) {
        cachedConnectors.MetaMask = new InjectedConnector({
          supportedChainIds: [
            1, // Mainnet
            4, // Rinkeby
          ],
        });
      }
      return cachedConnectors.MetaMask;
    },
  },
  {
    name: "WalletConnect",
    logo: walletconnectLogo,
    isProviderInstalled: isWalletProviderInstalled("WalletConnect"),
    url: "https://walletconnect.com/",
    getConnector: () => {
      if (!cachedConnectors.WalletConnect) {
        cachedConnectors.WalletConnect = new WalletConnectConnector({
          rpc: {
            1: process.env.REACT_APP_RPC_URL_1 || "",
            4: process.env.REACT_APP_RPC_URL_4 || "",
          },
        });
      }
      return cachedConnectors.WalletConnect;
    },
  },
];

export default SUPPORTED_WALLET_PROVIDERS;

export { AbstractConnector };
