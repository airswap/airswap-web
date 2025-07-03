import { BalancesState } from "./balancesSlice";

export type Allowances = {
  swap: BalancesState;
  swapERC20: BalancesState;
  wrapper: BalancesState;
  delegate: BalancesState;
};
