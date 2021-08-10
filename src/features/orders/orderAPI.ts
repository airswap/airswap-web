import { Registry, Light, ERC20 } from "@airswap/protocols";
import { LightOrder } from "@airswap/types";
import { toAtomicString } from "@airswap/utils";

import { BigNumber, ethers, Transaction } from "ethers";

export async function requestOrder(
  chainId: number,
  signerToken: string,
  senderToken: string,
  senderAmount: string,
  senderWallet: string,
  provider: ethers.providers.Web3Provider
): Promise<LightOrder[]> {
  const servers = await new Registry(chainId, provider).getServers(
    signerToken,
    senderToken
  );
  const orderPromises = servers.map(async (server) => {
    const order = await server.getSignerSideOrder(
      toAtomicString(senderAmount, 18),
      signerToken,
      senderToken,
      senderWallet
    );
    return (order as any) as LightOrder;
  });
  const orders = await Promise.allSettled(orderPromises);
  const successfulOrders = orders
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<LightOrder>).value);
  return successfulOrders;
}

export async function approveToken(
  senderToken: string,
  provider: ethers.providers.Web3Provider
) {
  const spender = Light.getAddress(provider.network.chainId);
  const approvalTxHash = await new ERC20(senderToken).approve(
    spender,
    provider.getSigner()
  );
  return (approvalTxHash as any) as Transaction;
}

export async function takeOrder(
  order: LightOrder,
  provider: ethers.providers.Web3Provider
) {
  const tx = await new Light(provider.network.chainId, provider).swap(
    order,
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
