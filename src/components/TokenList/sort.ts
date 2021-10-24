import { TokenInfo } from "@airswap/types";
import { formatUnits } from "@ethersproject/units";

import { BalancesState } from "../../features/balances/balancesSlice";

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

function getTokenBalance(token: TokenInfo, balances: BalancesState): number {
  const balance = balances.values[token.address];

  if (!balance) {
    return 0;
  }

  return parseFloat(
    formatUnits(balances.values[token.address]!, token.decimals)
  );
}

export function sortTokensBySymbolAndBalance(
  tokens: TokenInfo[],
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

    return a.symbol.toLocaleLowerCase() < b.symbol.toLocaleLowerCase() ? -1 : 1;
  });
}

export function sortTokenByExactMatch(
  filteredTokens: TokenInfo[],
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
  const exactMatches: TokenInfo[] = [];
  const symbolSubtrings: TokenInfo[] = [];
  const remainder: TokenInfo[] = [];

  filteredTokens.forEach((token) => {
    // add exact matches
    if (token.symbol?.toLowerCase() === symbolMatch[0]) {
      return exactMatches.push(token);
    }
    // add matches with starting values
    else if (
      token.symbol?.toLowerCase().startsWith(tokenQuery.toLowerCase().trim())
    ) {
      return symbolSubtrings.push(token);
    }
    // add remaining filtered tokens
    else {
      return remainder.push(token);
    }
  });

  return [...exactMatches, ...symbolSubtrings, ...remainder];
}
