import { useAppSelector } from "../app/hooks";
import { selectPendingCancellations } from "../features/transactions/transactionsSlice";
import { useMemo } from "react";

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
