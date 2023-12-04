import nativeCurrency, {
  nativeCurrencyAddress,
} from "../constants/nativeCurrency";
import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@airswap/types";

export default function findEthOrTokenByAddress(
  tokenAddress: string,
  activeTokens: TokenInfo[],
  chainId: number,
): TokenInfo | null {
  return tokenAddress === nativeCurrencyAddress
    ? nativeCurrency[chainId]
    : findTokenByAddress(tokenAddress, activeTokens);
}
