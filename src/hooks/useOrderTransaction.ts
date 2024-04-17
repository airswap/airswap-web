import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { SubmittedTransaction } from "../entities/SubmittedTransaction/SubmittedTransaction";
import { isSubmittedOrder } from "../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { selectOrderTransactions } from "../features/transactions/transactionsSlice";

const useOrderTransaction = (
  nonce: string
): SubmittedTransaction | undefined => {
  const transactions = useAppSelector(selectOrderTransactions);

  return useMemo(() => {
    return transactions.find(
      (transaction) =>
        isSubmittedOrder(transaction) && transaction.order.nonce === nonce
    );
  }, [transactions, nonce]);
};

export default useOrderTransaction;
