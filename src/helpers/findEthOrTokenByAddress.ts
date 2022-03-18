import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import nativeCurrency from "../constants/nativeCurrency";

export default function findEthOrTokenByAddress(
  tokenAddress: string,
  activeTokens: TokenInfo[],
  chainId: number
) {
  return tokenAddress === "0x0000000000000000000000000000000000000000"
    ? nativeCurrency[chainId!]
    : findTokenByAddress(tokenAddress, activeTokens);
}
