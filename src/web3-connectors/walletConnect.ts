import { ChainIds } from "@airswap/utils";
import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect-v2";

import { Connection, ConnectionType } from "./connections";
import { onConnectionError } from "./helpers";

const chains = Object.keys(ChainIds).map(Number).filter(Number);

export const buildWalletConnectConnector = () => {
  const [web3WalletConnect, web3WalletConnectHooks] =
    initializeConnector<WalletConnect>(
      (actions) =>
        new WalletConnect({
          actions,
          options: {
            projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || "",
            chains: [
              ChainIds.MAINNET,
              ChainIds.SEPOLIA,
              ChainIds.POLYGON,
              ChainIds.MUMBAI,
            ],
            optionalChains: chains.filter(
              (chain) => chain !== ChainIds.MAINNET
            ),
            showQrModal: true,
          },
          onError: onConnectionError,
        })
    );
  const walletConnectConnection: Connection = {
    connector: web3WalletConnect,
    hooks: web3WalletConnectHooks,
    type: ConnectionType.walletConnect,
  };
  return walletConnectConnection;
};
