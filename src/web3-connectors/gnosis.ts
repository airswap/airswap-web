import { initializeConnector } from "@web3-react/core";
import { GnosisSafe } from "@web3-react/gnosis-safe";

import { Connection, ConnectionType } from "./connections";

export function buildGnosisSafeConnector() {
  const [gnosisSafe, gnosisSafeHooks] = initializeConnector<GnosisSafe>(
    (actions) =>
      new GnosisSafe({
        actions,
        options: {
          debug: true,
        },
      })
  );
  const gnosisSafeConnection: Connection = {
    connector: gnosisSafe,
    hooks: gnosisSafeHooks,
    type: ConnectionType.gnosis,
  };

  return gnosisSafeConnection;
}
