import { ethers } from "ethers";
import { Server, Light, ERC20 } from "@airswap/protocols";
import { LightOrder } from "@airswap/types";
import { toAtomicString } from "@airswap/utils";

export async function requestOrder(
  url: string,
  chainId: string,
  signerToken: string,
  senderToken: string,
  senderAmount: string,
  senderWallet: string
) {
  const server = new Server(url, Light.getAddress(chainId));
  const order = await server.getSignerSideOrder(
    toAtomicString(senderAmount, 18),
    signerToken,
    senderToken,
    senderWallet
  );
  return order as any as LightOrder;
}

export async function approveToken(
  senderToken: string,
  provider: ethers.providers.Web3Provider
) {
  const spender = Light.getAddress(String(provider.network.chainId));
  const approvalTxHash = await new ERC20(senderToken).approve(
    spender,
    provider.getSigner()
  );
  return approvalTxHash;
}

export async function takeOrder(
  order: LightOrder,
  provider: ethers.providers.Web3Provider
) {
  const txHash = await new Light(
    String(provider.network.chainId),
    provider
  ).swap(order, provider.getSigner());
  return txHash;
}
