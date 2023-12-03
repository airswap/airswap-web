import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@airswap/types";
import { ADDRESS_ZERO } from "@airswap/constants";

import nativeCurrency from "../constants/nativeCurrency";

export default function findEthOrTokenByAddress(
  tokenAddress: string,
  activeTokens: TokenInfo[],
  chainId: number
): TokenInfo | null {
  return tokenAddress === ADDRESS_ZERO
    ? nativeCurrency[chainId]
    : findTokenByAddress(tokenAddress, activeTokens);
}
