import { Server } from "@airswap/libraries";
import { OrderERC20, toAtomicString } from "@airswap/utils";

import { BigNumber } from "ethers";

import { isPromiseFulfilledResult } from "../../helpers/promise";
import { isOrderERC20 } from "./OrderERC20Helpers";

const REQUEST_ORDER_TIMEOUT_MS = 5000;

export async function requestRfqOrders(
  servers: Server[],
  quoteToken: string,
  baseToken: string,
  baseTokenAmount: string,
  baseTokenDecimals: number,
  senderWallet: string,
  proxyingFor?: string
): Promise<OrderERC20[]> {
  if (!servers.length) {
    console.error("[requestOrders] No counterparties");

    return [];
  }

  const promises = servers.map(async (server) =>
    Promise.race([
      server.getSignerSideOrderERC20(
        toAtomicString(baseTokenAmount, baseTokenDecimals),
        quoteToken,
        baseToken,
        senderWallet,
        proxyingFor
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), REQUEST_ORDER_TIMEOUT_MS)
      ),
    ])
  );

  const results = await Promise.allSettled(promises);

  return results
    .filter((response): response is PromiseFulfilledResult<unknown> =>
      isPromiseFulfilledResult<unknown>(response)
    )
    .map((result) => result.value)
    .filter(isOrderERC20)
    .filter((o) => BigNumber.from(o.signerAmount).gt("0"));
}
