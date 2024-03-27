import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { SubmittedTransaction } from "../entities/SubmittedTransaction/SubmittedTransaction";
import { selectOrderTransactions } from "../features/transactions/transactionsSlice";

const useOrderTransaction = (
  nonce: string
): SubmittedTransaction | undefined => {
  const transactions = useAppSelector(selectOrderTransactions);

  return useMemo(() => {
    return transactions.find((transaction) => transaction.nonce === nonce);
  }, [transactions, nonce]);
};

export default useOrderTransaction;
