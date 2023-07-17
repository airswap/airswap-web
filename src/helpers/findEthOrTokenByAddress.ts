import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@airswap/types";

import nativeCurrency, {
  nativeCurrencyAddress,
} from "../constants/nativeCurrency";

export default function findEthOrTokenByAddress(
  tokenAddress: string,
  activeTokens: TokenInfo[],
  chainId: number
): TokenInfo | null {
  return tokenAddress === nativeCurrencyAddress
    ? nativeCurrency[chainId]
    : findTokenByAddress(tokenAddress, activeTokens);
}
