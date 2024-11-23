import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../app/hooks";
import {
  selectAllowancesSwap,
  selectAllowancesWrapper,
  selectBalances,
} from "../features/balances/balancesSlice";

export const useBalanceLoading = () => {
  const { isActive, isDisconnected, isInitialized } = useAppSelector(
    (state) => state.web3
  );

  const { account } = useWeb3React();
  const balances = useAppSelector(selectBalances);
  const swapAllowances = useAppSelector(selectAllowancesSwap);
  const wrapperAllowances = useAppSelector(selectAllowancesWrapper);

  const [isLoading, setIsLoading] = useState(false);

  const isBalancesLoading = balances.status === "fetching";
  const isSwapLoading = swapAllowances.status === "fetching";
  const isWrapperLoading = wrapperAllowances.status === "fetching";

  // Fires after wallet connect or wallet change
  useEffect(() => {
    if (isInitialized && isActive && account) {
      setIsLoading(true);
    }
  }, [account]);

  // Fires after balances, swap allowances, and wrapper allowances are fetched
  useEffect(() => {
    if (!isBalancesLoading && !isSwapLoading && !isWrapperLoading && isActive) {
      setIsLoading(false);
    }
  }, [isBalancesLoading, isSwapLoading, isWrapperLoading]);

  // This will be true when the page loads and the wallet is connected
  if (!isInitialized && !isDisconnected) {
    return true;
  }

  return isLoading;
};
