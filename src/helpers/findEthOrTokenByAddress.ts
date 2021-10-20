import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import nativeETH from "../constants/nativeETH";

export default function findEthOrTokenByAddress(
  tokenAddress: string,
  activeTokens: TokenInfo[],
  chainId: number
) {
  return tokenAddress === "0x0000000000000000000000000000000000000000"
    ? nativeETH[chainId!]
    : findTokenByAddress(tokenAddress, activeTokens);
}
