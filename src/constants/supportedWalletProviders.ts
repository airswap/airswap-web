import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import metamaskLogo from "../assets/wallet-provider-logos/metamask.svg";
import walletconnectLogo from "../assets/wallet-provider-logos/walletconnect.svg";

export type WalletProvider = {
  name: string;
  logo: string;
  getConnector: () => AbstractConnector;
};

const cachedConnectors: Record<string, AbstractConnector> = {};

const SUPPORTED_WALLET_PROVIDERS: WalletProvider[] = [
  {
    name: "MetaMask",
    logo: metamaskLogo,
    getConnector: () => {
      if (!cachedConnectors.MetaMask) {
        cachedConnectors.MetaMask = new InjectedConnector({
          supportedChainIds: [
            1, // Mainet
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
    getConnector: () => {
      if (!cachedConnectors.WalletConect) {
        cachedConnectors.MetaMask = new WalletConnectConnector({
          rpc: {
            1: process.env.REACT_APP_RPC_URL_1 || "",
            4: process.env.REACT_APP_RPC_URL_4 || "",
          },
        });
      }
      return cachedConnectors.WalletConect;
    },
  },
];

export default SUPPORTED_WALLET_PROVIDERS;

export { AbstractConnector };
