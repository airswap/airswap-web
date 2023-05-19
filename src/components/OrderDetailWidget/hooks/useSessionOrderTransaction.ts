import { useMemo } from "react";

import { useAppSelector } from "../../../app/hooks";
import {
  selectOrderTransactions,
  SubmittedTransaction,
} from "../../../features/transactions/transactionsSlice";

// This hook is very similar to useOrderTransaction but it will only return transactions that have been added since the component was mounted.

const useSessionOrderTransaction = (
  nonce: string
): SubmittedTransaction | undefined => {
  const transactions = useAppSelector(selectOrderTransactions);

  const initialTransactions = useMemo(() => {
    return transactions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newTransactions = transactions.filter(
    (transaction) =>
      !initialTransactions.some(
        (initialTransaction) => initialTransaction.hash === transaction.hash
      )
  );

  return useMemo(() => {
    return newTransactions.find((transaction) => transaction.nonce === nonce);
  }, [newTransactions, nonce]);
};

export default useSessionOrderTransaction;
