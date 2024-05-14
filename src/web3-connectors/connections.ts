import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";

import { buildCoinbaseWalletConnector } from "./coinbase";
import { buildGnosisSafeConnector } from "./gnosis";
import { buildInjectedConnector } from "./injected";
import { buildWalletConnectConnector } from "./walletConnect";

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

export enum ConnectionType {
  coinbase = "coinbase",
  injected = "injected",
  walletConnect = "walletConnect",
  gnosis = "gnosis",
}

export const prioritizedConnectors: { [key in ConnectionType]: Connection } = {
  [ConnectionType.coinbase]: buildCoinbaseWalletConnector(),
  [ConnectionType.injected]: buildInjectedConnector(),
  [ConnectionType.walletConnect]: buildWalletConnectConnector(),
  [ConnectionType.gnosis]: buildGnosisSafeConnector(),
};

export function getConnection(c: Connector | ConnectionType): Connection {
  if (c instanceof Connector) {
    const connection = Object.values(prioritizedConnectors).find(
      (connector) => connector.connector === c
    );
    if (!connection) {
      throw Error("Unsupported Connector");
    }

    return connection;
  }

  if (c === ConnectionType.coinbase) {
    return prioritizedConnectors[ConnectionType.coinbase];
  }

  if (c === ConnectionType.walletConnect) {
    return prioritizedConnectors[ConnectionType.walletConnect];
  }

  if (c === ConnectionType.gnosis) {
    return prioritizedConnectors[ConnectionType.gnosis];
  }

  return prioritizedConnectors[ConnectionType.injected];
}
