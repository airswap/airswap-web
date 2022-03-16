import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import metamaskLogo from "../assets/wallet-provider-logos/metamask.svg";
import walletconnectLogo from "../assets/wallet-provider-logos/walletconnect.svg";

declare let window: any;

export type WalletProvider = {
  name: string;
  logo: string;
  isInstalled: boolean;
  url: string;
  getConnector: () => AbstractConnector;
};

const cachedConnectors: Record<string, AbstractConnector> = {};

const SUPPORTED_WALLET_PROVIDERS: WalletProvider[] = [
  {
    name: "MetaMask",
    logo: metamaskLogo,
    isInstalled: typeof window.ethereum !== "undefined",
    url: "https://metamask.io/",
    getConnector: () => {
      if (!cachedConnectors.MetaMask) {
        cachedConnectors.MetaMask = new InjectedConnector({
          supportedChainIds: [
            1,
            4,
            5,
            56,
            97,
            43113,
            43114,
          ],
        });
      }
      return cachedConnectors.MetaMask;
    },
  },
  {
    name: "WalletConnect",
    logo: walletconnectLogo,
    isInstalled: true,
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
