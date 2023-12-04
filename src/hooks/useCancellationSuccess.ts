import { useAppSelector } from "../app/hooks";
import { selectCancellations } from "../features/transactions/transactionsSlice";
import { useMemo } from "react";

const useCancellationSuccess = (nonce: string): boolean => {
  const canceledTransactions = useAppSelector(selectCancellations);

  return useMemo(() => {
    return canceledTransactions.some(
      (transaction) => transaction.nonce === nonce,
    );
  }, [nonce, canceledTransactions]);
};

export default useCancellationSuccess;
