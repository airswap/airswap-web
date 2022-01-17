import { etherscanDomains } from "@airswap/constants";

// TODO: Add this to airswap-protocols

export function getEtherscanWalletURL(
  chainId: number,
  address: string
): string {
  return `https://${etherscanDomains[chainId]}/address/${address}`;
}
