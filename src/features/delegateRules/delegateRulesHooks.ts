import { useEffect } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchDelegateRules } from "./delegateRulesApi";
import { getDismissedDelegateRulesFromLocalStorage } from "./delegateRulesHelpers";
import { setDismissedDelegateRuleIds } from "./delegateRulesSlice";
import useSetRuleLogs from "./hooks/useSetRuleLogs";

export const useDelegateRules = () => {
  const { provider: library } = useWeb3React();
  const { account, chainId } = useAppSelector((state) => state.web3);
  // We need to wait for the transactions to be initialized to prevent querying the contract events simultaneously
  const { isInitialized: isTransactionsInitialized } = useAppSelector(
    (state) => state.transactions
  );

  const dispatch = useAppDispatch();
  const { result: setRuleLogs, status } = useSetRuleLogs(
    chainId,
    isTransactionsInitialized ? account : null
  );

  useEffect(() => {
    if (!setRuleLogs || !library) {
      return;
    }

    if (
      !isTransactionsInitialized ||
      status !== "success" ||
      setRuleLogs.chainId !== chainId ||
      setRuleLogs.account !== account
    ) {
      return;
    }

    const dismissedDelegateRuleIds = getDismissedDelegateRulesFromLocalStorage(
      account,
      chainId
    );

    dispatch(
      fetchDelegateRules({ delegateRules: setRuleLogs.delegateRules, library })
    );

    if (dismissedDelegateRuleIds.length) {
      dispatch(setDismissedDelegateRuleIds(dismissedDelegateRuleIds));
    }
  }, [
    isTransactionsInitialized,
    status,
    setRuleLogs,
    chainId,
    account,
    dispatch,
  ]);
};
