import {
  BitKeep,
  BitKeepConstructorArgs,
} from "@akkafinance/web3-react-bitkeep";
import { initializeConnector } from "@web3-react/core";

import { getRpcUrl } from "../helpers/ethers";
import { Connection, ConnectionType } from "./connections";
import { onConnectionError } from "./helpers";

const chainId = +(process.env.REACT_APP_CHAIN_ID || "1");
const rpcUrl = getRpcUrl(chainId);

export function buildBitKeepWalletConnector() {
  const [web3BitKeepWallet, web3BitKeepWalletHooks] =
    initializeConnector<BitKeep>(
      (actions) =>
        new BitKeep({
          actions,
          options: {
            appName: "Airswap webapp",
            url: rpcUrl || "",
          } as BitKeepConstructorArgs["options"],
          onError: onConnectionError,
        })
    );
  const coinbaseWalletConnection: Connection = {
    connector: web3BitKeepWallet,
    hooks: web3BitKeepWalletHooks,
    type: ConnectionType.coinbase,
  };

  return coinbaseWalletConnection;
}
