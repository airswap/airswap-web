import {
  CoinbaseWallet,
  CoinbaseWalletConstructorArgs,
} from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";

import { getRpcUrl } from "../helpers/getRpcUrl";
import { Connection, ConnectionType } from "./connections";
import { onConnectionError } from "./helpers";

const chainId = +(process.env.REACT_APP_CHAIN_ID || "1");
const rpcUrl = getRpcUrl(chainId);

export function buildCoinbaseWalletConnector() {
  // @ts-ignore
  const [web3CoinbaseWallet, web3CoinbaseWalletHooks] =
    initializeConnector<CoinbaseWallet>(
      (actions) =>
        new CoinbaseWallet({
          actions,
          options: {
            appName: "AirSwap webapp",
            url: rpcUrl || "",
            overrideIsCoinbaseWallet: true,
          } as CoinbaseWalletConstructorArgs["options"],
          onError: onConnectionError,
        })
    );
  const coinbaseWalletConnection: Connection = {
    connector: web3CoinbaseWallet,
    hooks: web3CoinbaseWalletHooks,
    type: ConnectionType.coinbase,
  };

  return coinbaseWalletConnection;
}
