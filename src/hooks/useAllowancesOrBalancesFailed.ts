import { useAppSelector } from "../app/hooks";
import {
  selectAllowances,
  selectBalances,
} from "../features/balances/balancesSlice";

export const useAllowancesOrBalancesFailed = (): boolean => {
  const balances = useAppSelector(selectBalances);
  const allowances = useAppSelector(selectAllowances);

  const isAllowancesFailed =
    allowances.swap.status === "failed" ||
    allowances.wrapper.status === "failed";
  const isBalancesFailed = balances.status === "failed";

  return isAllowancesFailed || isBalancesFailed;
};

export default useAllowancesOrBalancesFailed;
