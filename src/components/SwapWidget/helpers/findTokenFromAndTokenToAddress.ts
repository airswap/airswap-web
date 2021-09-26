import { findTokenByAddress, findTokensBySymbol } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import nativeETH from "../../../constants/nativeETH";

export default function findTokenFromAndTokenToAddress(
  allTokens: TokenInfo[],
  fromSymbol: string,
  toSymbol: string,
  fromAddress?: string,
  toAddress?: string,
  chainId?: number
): { fromAddress: string | undefined; toAddress: string | undefined } {
  let fromToken: TokenInfo | undefined;
  let toToken: TokenInfo | undefined;

  if (fromAddress) {
    fromToken = fromAddress
      ? fromAddress === "0x0000000000000000000000000000000000000000"
        ? nativeETH[chainId!]
        : findTokenByAddress(fromAddress, allTokens)
      : undefined;
    toToken = toAddress
      ? toAddress === "0x0000000000000000000000000000000000000000"
        ? nativeETH[chainId!]
        : findTokenByAddress(toAddress, allTokens)
      : undefined;

    return {
      fromAddress: fromToken ? fromToken.address : undefined,
      toAddress: toToken ? toToken.address : undefined,
    };
  }

  fromToken = findTokensBySymbol(fromSymbol, allTokens)[0];
  toToken = findTokensBySymbol(toSymbol, allTokens)[0];

  return {
    fromAddress: fromToken ? fromToken.address : undefined,
    toAddress: toToken ? toToken.address : undefined,
  };
}
