import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { selectPendingCancellations } from "../features/transactions/transactionsSlice";

const useCancellationPending = (nonce: string | null): boolean => {
  const pendingCancellations = useAppSelector(selectPendingCancellations);

  return useMemo(() => {
    if (!nonce) {
      return false;
    }

    return pendingCancellations.some((tx) => tx.nonce === nonce);
  }, [nonce, pendingCancellations]);
};

export default useCancellationPending;
