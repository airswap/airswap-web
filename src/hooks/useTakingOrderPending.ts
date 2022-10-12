import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { selectPendingTransactions } from "../features/transactions/transactionsSlice";

const useTakingOrderPending = (nonce: string): boolean => {
  const pendingTransactions = useAppSelector(selectPendingTransactions);

  return useMemo(() => {
    return pendingTransactions.some(
      (transaction) => transaction.nonce === nonce
    );
  }, [pendingTransactions, nonce]);
};

export default useTakingOrderPending;
