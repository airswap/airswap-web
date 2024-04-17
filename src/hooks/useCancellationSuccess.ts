import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { selectCancellations } from "../features/transactions/transactionsSlice";
import { TransactionStatusType } from "../types/transactionTypes";

const useCancellationSuccess = (nonce: string): boolean => {
  const canceledTransactions = useAppSelector(selectCancellations);

  const transaction = useMemo(() => {
    return canceledTransactions.find(
      (transaction) => transaction.nonce === nonce
    );
  }, [nonce, canceledTransactions]);

  return transaction?.status === TransactionStatusType.succeeded;
};

export default useCancellationSuccess;
