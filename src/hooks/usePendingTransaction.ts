import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { selectPendingTransactions } from "../features/transactions/transactionsSlice";

const usePendingTransaction = (nonce: string|undefined): boolean => {
  const pendingTransactions = useAppSelector(selectPendingTransactions);

  return useMemo(() => {
    return pendingTransactions.some(
      (transaction) => transaction.nonce === nonce
    );
  }, [nonce, pendingTransactions]);
};

export default usePendingTransaction;
