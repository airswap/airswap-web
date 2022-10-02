import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { selectPendingApprovals } from "../features/transactions/transactionsSlice";

const useApprovalPending = (tokenAddress?: string | null): boolean => {
  const pendingApprovals = useAppSelector(selectPendingApprovals);

  return useMemo(() => {
    if (!tokenAddress || !pendingApprovals.length) {
      return false;
    }

    return pendingApprovals.some((tx) => tx.tokenAddress === tokenAddress);
  }, [tokenAddress, pendingApprovals]);
};

export default useApprovalPending;
