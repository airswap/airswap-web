import { formatUnits } from "@ethersproject/units";
import { TokenInfo } from "@uniswap/token-lists";

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
