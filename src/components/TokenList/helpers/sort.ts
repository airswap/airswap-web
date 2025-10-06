import { TokenInfo } from "@airswap/utils";
import { formatUnits } from "@ethersproject/units";

import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  getTokenDecimals,
  getTokenId,
  getTokenSymbol,
} from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { BalancesState } from "../../../features/balances/balancesSlice";

export function sortTokensByBalance(
  tokens: TokenInfo[],
  balances: BalancesState
) {
  return tokens.sort((a, b) =>
    parseFloat(formatUnits(balances.values[a.address]!, a.decimals)) <
    parseFloat(formatUnits(balances.values[b.address]!, b.decimals))
      ? 1
      : parseFloat(formatUnits(balances.values[a.address]!, a.decimals)) ===
        parseFloat(formatUnits(balances.values[b.address]!, b.decimals))
      ? a.symbol > b.symbol
        ? 1
        : -1
      : -1
  );
}

export function sortTokensBySymbol(tokens: TokenInfo[]) {
  return tokens.sort((a, b) =>
    a.symbol.toLocaleLowerCase() < b.symbol.toLocaleLowerCase() ? -1 : 1
  );
}

function getTokenBalance(token: AppTokenInfo, balances: BalancesState): number {
  const tokenId = getTokenId(token);
  const balance = balances.values[tokenId];

  if (!balance) {
    return 0;
  }

  return parseFloat(formatUnits(balance, getTokenDecimals(token)));
}

export function sortTokensBySymbolAndBalance(
  tokens: AppTokenInfo[],
  balances: BalancesState
) {
  return tokens.sort((a, b) => {
    const aBalance = getTokenBalance(a, balances);
    const bBalance = getTokenBalance(b, balances);

    if (aBalance === 0 && bBalance !== 0) {
      return 1;
    } else if (bBalance === 0 && aBalance !== 0) {
      return -1;
    }

    const aSymbol = getTokenSymbol(a).toLowerCase();
    const bSymbol = getTokenSymbol(b).toLowerCase();

    return aSymbol < bSymbol ? -1 : 1;
  });
}

export function sortTokenByExactMatch(
  filteredTokens: AppTokenInfo[],
  tokenQuery: string
) {
  if (!filteredTokens.length) return [];
  if (!tokenQuery || tokenQuery === "") return filteredTokens;

  // split query into word array
  const symbolMatch = tokenQuery
    .toLowerCase()
    .split(/\s+/)
    .filter((s) => s.length > 0);

  // don't filter against symbol if query is multiple words
  if (symbolMatch.length > 1) return filteredTokens;

  // filter based off symbol match -> substring match -> remainder of filtered tokens
  const exactMatches: AppTokenInfo[] = [];
  const symbolSubtrings: AppTokenInfo[] = [];
  const remainder: AppTokenInfo[] = [];

  filteredTokens.forEach((token) => {
    // add exact matches
    const tokenSymbol = getTokenSymbol(token).toLowerCase();

    if (tokenSymbol === symbolMatch[0]) {
      return exactMatches.push(token);
    }
    // add matches with starting values
    else if (tokenSymbol.startsWith(tokenQuery.toLowerCase().trim())) {
      return symbolSubtrings.push(token);
    }
    // add remaining filtered tokens
    else {
      return remainder.push(token);
    }
  });

  return [...exactMatches, ...symbolSubtrings, ...remainder];
}
