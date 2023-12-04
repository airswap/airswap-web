import { useAppSelector } from "../app/hooks";
import {
  selectOrderTransactions,
  SubmittedTransaction,
} from "../features/transactions/transactionsSlice";
import { useMemo } from "react";

const useOrderTransaction = (
  nonce: string,
): SubmittedTransaction | undefined => {
  const transactions = useAppSelector(selectOrderTransactions);

  return useMemo(() => {
    return transactions.find((transaction) => transaction.nonce === nonce);
  }, [transactions, nonce]);
};

export default useOrderTransaction;
