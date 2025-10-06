import { useAppSelector } from "../app/hooks";

export const useAllowancesLoading = () => {
  const allowances = useAppSelector((state) => state.allowances);
  const balances = useAppSelector((state) => state.balances);

  const isLoading =
    allowances.delegate.status === "fetching" ||
    allowances.swap.status === "fetching" ||
    allowances.wrapper.status === "fetching" ||
    allowances.swapERC20.status === "fetching" ||
    balances.status === "fetching";

  return isLoading;
};
