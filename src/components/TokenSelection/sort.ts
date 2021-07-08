import { TokenInfo } from "@uniswap/token-lists";
import { formatUnits } from "@ethersproject/units";
import { BalancesState } from "../../features/balances/balancesSlice";

export function sortTokensByBalance(
  tokens: TokenInfo[],
  balances: BalancesState
) {
  return tokens.sort((a, b) =>
    formatUnits(balances.values[a.address]!, a.decimals) <
    formatUnits(balances.values[b.address]!, b.decimals)
      ? 1
      : formatUnits(balances.values[a.address]!, a.decimals) ===
        formatUnits(balances.values[b.address]!, b.decimals)
      ? a.symbol > b.symbol
        ? 1
        : -1
      : -1
  );
}
