import { Server, Swap, SwapERC20 } from "@airswap/libraries";
import {
  FullOrderERC20,
  OrderERC20,
  toAtomicString,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";

import { BigNumber } from "bignumber.js";
import { ContractTransaction, ethers } from "ethers";

import { isAppError } from "../../errors/appError";
import { createOrderERC20Signature } from "../../helpers/createSwapSignature";
import { isPromiseFulfilledResult } from "../../helpers/promise";
import { getSwapErc20Address } from "../../helpers/swapErc20";
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
    getSwapErc20Address(chainId)!,
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

export const getOrderErc20NonceUsed = async (
  order: FullOrderERC20,
  provider: ethers.providers.BaseProvider
) => {
  return SwapERC20.getContract(provider, order.chainId).nonceUsed(
    order.signerWallet,
    order.nonce
  );
};

export const cancelOrderErc20 = async (
  order: OrderERC20,
  provider: ethers.providers.BaseProvider
): Promise<ContractTransaction> => {
  return SwapERC20.getContract(provider, provider.network.chainId).cancel([
    order.nonce,
  ]);
};
