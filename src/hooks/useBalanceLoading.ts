import { useEffect, useState } from "react";

import { useAppSelector } from "../app/hooks";
import {
  selectAllowancesSwap,
  selectAllowancesWrapper,
  selectBalances,
} from "../features/balances/balancesSlice";
import useDebounce from "./useDebounce";

export const useBalanceLoading = () => {
  const { account, chainId, isInitialized } = useAppSelector(
    (state) => state.web3
  );
  const balances = useAppSelector(selectBalances);
  const swapAllowances = useAppSelector(selectAllowancesSwap);
  const wrapperAllowances = useAppSelector(selectAllowancesWrapper);

  const [isLoading, setIsLoading] = useState(true);
  const [debouncedInitialized, setDebouncedInitialized] =
    useState(isInitialized);

  const isBalancesLoading = balances.status === "fetching";
  const isSwapLoading = swapAllowances.status === "fetching";
  const isWrapperLoading = wrapperAllowances.status === "fetching";

  // Debouncing isInitialized will solve flickering when switching between accounts
  useDebounce(
    () => {
      setDebouncedInitialized(isInitialized);
    },
    100,
    [isInitialized]
  );

  useEffect(() => {
    if (account) {
      setIsLoading(true);
    }
  }, [account, chainId]);

  useEffect(() => {
    if (!isBalancesLoading && !isSwapLoading && !isWrapperLoading) {
      setIsLoading(false);
    }
  }, [isBalancesLoading, isSwapLoading, isWrapperLoading]);

  const snavie = isLoading || !debouncedInitialized;

  console.log("snavie", snavie);

  return snavie;
};
