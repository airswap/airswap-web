import { useAppSelector } from "../app/hooks";
import { selectMyOtcOrdersReducer } from "../features/myOtcOrders/myOtcOrdersSlice";

export const useActiveOrdersCount = () => {
  const { userOrders } = useAppSelector(selectMyOtcOrdersReducer);
  const {
    delegateRules,
    isInitialized: isDelegateRulesInitialized,
    dismissedDelegateRuleIds,
  } = useAppSelector((state) => state.delegateRules);
  const filteredDelegateRules = delegateRules.filter(
    (rule) =>
      !dismissedDelegateRuleIds.includes(rule.id) &&
      +rule.expiry * 1000 > Date.now()
  );
  const filteredUserOrders = userOrders.filter(
    (order) => +order.expiry * 1000 > Date.now()
  );

  const activeOrdersCount =
    filteredUserOrders.length + filteredDelegateRules.length;

  return isDelegateRulesInitialized ? activeOrdersCount : 0;
};
