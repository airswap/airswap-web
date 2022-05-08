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
    // TODO: Remove toLowerCase() when this PR is in production: https://github.com/airswap/airswap-protocols/pull/849
    : findTokenByAddress(tokenAddress.toLowerCase(), activeTokens);
}
