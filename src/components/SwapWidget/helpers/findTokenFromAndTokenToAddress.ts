import { findTokensBySymbol } from "@airswap/metadata";
import { TokenInfo } from "@airswap/types";

import findEthOrTokenByAddress from "../../../helpers/findEthOrTokenByAddress";

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

  if (fromAddress && fromAddress !== "-") {
    fromToken =
      (fromAddress &&
        findEthOrTokenByAddress(fromAddress, allTokens, chainId!)) ||
      findTokensBySymbol(fromSymbol, allTokens)[0];
    toToken =
      (toAddress && findEthOrTokenByAddress(toAddress, allTokens, chainId!)) ||
      findTokensBySymbol(toSymbol, allTokens)[0];

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
