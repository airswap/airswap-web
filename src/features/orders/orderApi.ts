import { Light, Server } from "@airswap/libraries";
import { LightOrder } from "@airswap/types";
import { toAtomicString } from "@airswap/utils";

import erc20Abi from "erc-20-abi";
import { BigNumber, ethers, Transaction, constants } from "ethers";

const REQUEST_ORDER_TIMEOUT_MS = 5000;

export async function requestOrders(
  servers: Server[],
  quoteToken: string,
  baseToken: string,
  baseTokenAmount: string,
  senderTokenDecimals: number,
  senderWallet: string
): Promise<LightOrder[]> {
  if (!servers.length) {
    throw new Error("no counterparties");
  }
  const rfqOrderPromises = servers.map(async (server) => {
    const order = await Promise.race([
      server.getSignerSideOrder(
        toAtomicString(baseTokenAmount, senderTokenDecimals),
        quoteToken,
        baseToken,
        senderWallet
      ),
      // Servers should respond in a timely manner for orders to be considered
      new Promise((resolve, reject) =>
        setTimeout(() => {
          reject("ETIMEDOUT");
        }, REQUEST_ORDER_TIMEOUT_MS)
      ),
    ]);
    return (order as any) as LightOrder;
  });
  const rfqOrders = await Promise.allSettled(rfqOrderPromises);
  const successfulRfqOrders = rfqOrders
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<LightOrder>).value);
  return successfulRfqOrders;
}

export async function approveToken(
  senderToken: string,
  provider: ethers.providers.Web3Provider
) {
  const spender = Light.getAddress(provider.network.chainId);
  const erc20Interface = new ethers.utils.Interface(erc20Abi);
  const erc20Contract = new ethers.Contract(
    senderToken,
    erc20Interface,
    provider.getSigner()
  );
  const approvalTxHash = await erc20Contract.approve(
    spender,
    constants.MaxUint256
  );
  return (approvalTxHash as any) as Transaction;
}

export async function takeOrder(
  order: LightOrder,
  provider: ethers.providers.Web3Provider
) {
  // @ts-ignore TODO: type compatability issue with AirSwap lib
  const tx = await new Light(provider.network.chainId, provider).swap(
    order,
    // @ts-ignore TODO: type compatability issue with AirSwap lib
    provider.getSigner()
  );
  return (tx as any) as Transaction;
}

export function orderSortingFunction(a: LightOrder, b: LightOrder) {
  // If tokens transferred are the same
  if (a.signerAmount === b.signerAmount && a.senderAmount === b.senderAmount) {
    return parseInt(b.expiry) - parseInt(a.expiry);
  }
  if (a.signerAmount === b.signerAmount) {
    // Likely senderSide
    // Sort orders by amount of senderToken sent (ascending).
    const aAmount = BigNumber.from(a.senderAmount);
    const bAmount = BigNumber.from(b.senderAmount);
    if (bAmount.lt(aAmount)) return 1;
    else return -1;
  } else {
    // Likely signerSide
    // Sort orders by amount of signerToken received (descending).
    const aAmount = BigNumber.from(a.signerAmount);
    const bAmount = BigNumber.from(b.signerAmount);
    if (bAmount.gt(aAmount)) return 1;
    else return -1;
  }
}
