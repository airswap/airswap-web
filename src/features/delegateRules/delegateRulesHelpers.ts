import { DelegateRule } from "../../entities/DelegateRule/DelegateRule";

export const getDismissedDelegateRulesLocalStorageKey = (
  account: string,
  chainId: string | number
) => `airswap/dismissedDelegateRules/${account}/${chainId}`;

export const writeDismissedDelegateRulesToLocalStorage = (
  delegateRuleIds: string[],
  account: string,
  chainId: string | number
) => {
  const key = getDismissedDelegateRulesLocalStorageKey(account, chainId);

  localStorage.setItem(key, JSON.stringify(delegateRuleIds));
};

export const getDismissedDelegateRulesFromLocalStorage = (
  account: string,
  chainId: string | number
): string[] => {
  const key = getDismissedDelegateRulesLocalStorageKey(account, chainId);

  const delegateRuleIds = localStorage.getItem(key);
  return delegateRuleIds ? JSON.parse(delegateRuleIds) : [];
};
