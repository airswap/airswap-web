import { etherscanDomains } from "@airswap/constants";

// TODO: Replace this with airswap-protocols when this PR is through:
// https://github.com/airswap/airswap-protocols/pull/769

export function getEtherscanWalletURL(
  chainId: number,
  address: string
): string {
  return `https://${etherscanDomains[chainId]}/address/${address}`;
}
