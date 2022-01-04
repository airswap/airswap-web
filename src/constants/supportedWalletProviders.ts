import { UAuthConnector } from "@uauth/web3-react";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import metamaskLogo from "../assets/wallet-provider-logos/metamask.svg";
import unstoppableLogo from "../assets/wallet-provider-logos/unstoppable.png";
import walletconnectLogo from "../assets/wallet-provider-logos/walletconnect.svg";

export type WalletProvider = {
  name: string;
  logo: string;
  getConnector: () => AbstractConnector;
};

const cachedConnectors: Record<string, AbstractConnector> = {};

// Setup uauth library
export const injected = new InjectedConnector({ supportedChainIds: [1] });

export const walletconnect = new WalletConnectConnector({
  infuraId: process.env.REACT_APP_INFURA_ID!,
  qrcode: true,
});

export const uauthConnector = new UAuthConnector({
  clientID: process.env.REACT_APP_CLIENT_ID!,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET!,
  redirectUri: process.env.REACT_APP_REDIRECT_URI!,
  postLogoutRedirectUri: process.env.REACT_APP_POST_LOGOUT_REDIRECT_URI!,
  // Scope must include openid and wallet
  scope: "openid wallet",

  // Injected and walletconnect connectors are required.
  connectors: { injected, walletconnect },
});

const SUPPORTED_WALLET_PROVIDERS: WalletProvider[] = [
  {
    name: "MetaMask",
    logo: metamaskLogo,
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
  {
    name: "Login with Unstoppable",
    logo: unstoppableLogo,
    getConnector: () => {
      if (!cachedConnectors.Unstoppable) {
        cachedConnectors.Unstoppable = uauthConnector;
      }
      return cachedConnectors.Unstoppable;
    },
  },
];

export default SUPPORTED_WALLET_PROVIDERS;

export { AbstractConnector };
