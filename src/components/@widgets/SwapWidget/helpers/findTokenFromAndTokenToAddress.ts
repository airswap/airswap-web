import { findTokensBySymbol, TokenInfo } from "@airswap/utils";

import { AppTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfo";
import { isTokenInfo } from "../../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import findEthOrTokenByAddress from "../../../../helpers/findEthOrTokenByAddress";

export default function findTokenFromAndTokenToAddress(
  allTokens: AppTokenInfo[],
  fromSymbol: string,
  toSymbol: string,
  fromAddress?: string,
  toAddress?: string,
  chainId?: number
): { fromAddress: string | undefined; toAddress: string | undefined } {
  let fromToken: AppTokenInfo | undefined;
  let toToken: AppTokenInfo | undefined;

  const erc20Tokens = allTokens.filter((token) =>
    isTokenInfo(token)
  ) as TokenInfo[];

  if (fromAddress && fromAddress !== "-") {
    fromToken =
      (fromAddress &&
        findEthOrTokenByAddress(fromAddress, allTokens, chainId!)) ||
      findTokensBySymbol(fromSymbol, erc20Tokens)[0];
    toToken =
      (toAddress && findEthOrTokenByAddress(toAddress, allTokens, chainId!)) ||
      findTokensBySymbol(toSymbol, erc20Tokens)[0];

    return {
      fromAddress: fromToken ? fromToken.address : undefined,
      toAddress: toToken ? toToken.address : undefined,
    };
  }

  fromToken = findTokensBySymbol(fromSymbol, erc20Tokens)[0];
  toToken = findTokensBySymbol(toSymbol, erc20Tokens)[0];
  return {
    fromAddress: fromToken ? fromToken.address : undefined,
    toAddress: toToken ? toToken.address : undefined,
  };
}
