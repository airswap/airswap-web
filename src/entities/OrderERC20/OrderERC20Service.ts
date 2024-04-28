import { Server, SwapERC20 } from "@airswap/libraries";
import {
  createOrderERC20,
  OrderERC20,
  Pricing,
  toAtomicString,
  TokenInfo,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";

import { BigNumber } from "bignumber.js";

import { LAST_LOOK_ORDER_EXPIRY_SEC } from "../../constants/configParams";
import { AppError, isAppError } from "../../errors/appError";
import { createOrderERC20Signature } from "../../helpers/createSwapSignature";
import { isPromiseFulfilledResult } from "../../helpers/promise";
import { ExtendedPricing } from "../ExtendedPricing/ExtendedPricing";
import { getPricingQuoteAmount } from "../ExtendedPricing/ExtendedPricingHelpers";
import { isOrderERC20 } from "./OrderERC20Helpers";
import { transformUnsignedOrderERC20ToOrderERC20 } from "./OrderERC20Transformers";

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

  servers.forEach((server) => server.disconnect());

  return results
    .filter((response): response is PromiseFulfilledResult<unknown> =>
      isPromiseFulfilledResult<unknown>(response)
    )
    .map((result) => result.value)
    .filter(isOrderERC20)
    .filter((o) => new BigNumber(o.signerAmount).gt("0"));
}

export const signOrderERC20AndSendForConsideration = async (
  chainId: number,
  library: Web3Provider,
  server: Server,
  unsignedOrder: UnsignedOrderERC20
) => {
  const signature = await createOrderERC20Signature(
    unsignedOrder,
    library.getSigner(),
    SwapERC20.getAddress(chainId)!,
    chainId
  );

  if (isAppError(signature)) {
    return;
  }

  const order = transformUnsignedOrderERC20ToOrderERC20(
    unsignedOrder,
    signature
  );

  server.considerOrderERC20(order);
};
