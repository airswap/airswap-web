import { ConnectionType } from "./connections";
import {
  getHasBitKeepExtensionInstalled,
  getHasMetaMaskExtensionInstalled,
  getHasRabbyExtensionInstalled,
} from "./helpers";

export type WalletProvider = {
  name: string;
  logo: string;
  isInstalled: boolean;
  url: string;
  type: ConnectionType;
};

const walletConnectProjectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;
const isBitKeepInstalled = getHasBitKeepExtensionInstalled();
const isMetamaskInstalled = getHasMetaMaskExtensionInstalled();
const isRabbyInstalled = getHasRabbyExtensionInstalled();

const metamask: WalletProvider = {
  name: "MetaMask",
  logo: "logos/metamask.svg",
  isInstalled: isMetamaskInstalled,
  url: "https://metamask.io/",
  type: ConnectionType.injected,
};

const rabby: WalletProvider = {
  name: "Rabby",
  logo: "logos/rabby.svg",
  isInstalled: isRabbyInstalled,
  url: "https://rabby.io/",
  type: ConnectionType.injected,
};

const walletProviders: WalletProvider[] = [
  ...(!isMetamaskInstalled && !isRabbyInstalled ? [metamask, rabby] : []),
  ...(isMetamaskInstalled && isRabbyInstalled ? [rabby] : []),
  ...(isMetamaskInstalled && !isRabbyInstalled ? [metamask] : []),
  ...(walletConnectProjectId
    ? [
        {
          name: "WalletConnect",
          logo: "logos/walletconnect.svg",
          isInstalled: true,
          url: "https://walletconnect.com/",
          type: ConnectionType.walletConnect,
        },
      ]
    : []),
  {
    name: "Coinbase",
    logo: "logos/coinbase.svg",
    isInstalled: true,
    url: "https://www.coinbase.com/wallet",
    type: ConnectionType.coinbase,
  },
  {
    name: "BitKeep",
    logo: "logos/bitkeep.png",
    isInstalled: isBitKeepInstalled,
    url: "https://web3.bitget.com/",
    type: ConnectionType.bitKeep,
  },
];

export default walletProviders;
