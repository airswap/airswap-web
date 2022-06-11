import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import nativeCurrency, {
  nativeCurrencyAddress,
} from "../constants/nativeCurrency";

export default function findEthOrTokenByAddress(
  tokenAddress: string,
  activeTokens: TokenInfo[],
  chainId: number
) {
  return tokenAddress === nativeCurrencyAddress
    ? nativeCurrency[chainId!]
    : findTokenByAddress(tokenAddress, activeTokens);
}
