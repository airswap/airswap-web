import { TokenInfo, findTokenByAddress, ADDRESS_ZERO } from "@airswap/utils";

import nativeCurrency from "../constants/nativeCurrency";

export default function findEthOrTokenByAddress(
  tokenAddress: string,
  activeTokens: TokenInfo[],
  chainId: number
): TokenInfo | null {
  return (
    tokenAddress === ADDRESS_ZERO
      ? nativeCurrency[chainId]
      : findTokenByAddress(tokenAddress, activeTokens)
  ) as TokenInfo;
}
