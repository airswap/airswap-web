import { TokenInfo } from "@uniswap/token-lists";
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
  return tokens.sort((a, b) => (a.symbol.toLocaleLowerCase() < b.symbol.toLocaleLowerCase() ? -1 : 1));
}
