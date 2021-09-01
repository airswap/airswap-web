import { findTokenByAddress, findTokensBySymbol } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

export default function findTokenFromAndTokenToAddress(
  allTokens: TokenInfo[],
  fromSymbol: string,
  toSymbol: string,
  fromAddress?: string,
  toAddress?: string
): { fromAddress: string | undefined; toAddress: string | undefined } {
  let fromToken: TokenInfo | undefined;
  let toToken: TokenInfo | undefined;

  if (fromAddress) {
    fromToken = fromAddress
      ? findTokenByAddress(fromAddress, allTokens)
      : undefined;
    toToken = toAddress ? findTokenByAddress(toAddress, allTokens) : undefined;

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
