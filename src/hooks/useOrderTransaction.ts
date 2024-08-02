import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { SubmittedTransaction } from "../entities/SubmittedTransaction/SubmittedTransaction";
import { isSubmittedOrder } from "../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import {
  selectOrderTransactions,
  selectTransactions,
} from "../features/transactions/transactionsSlice";

const useOrderTransaction = (
  nonce?: string,
  hash?: string
): SubmittedTransaction | undefined => {
  const transactions = useAppSelector(selectTransactions);

  return useMemo(() => {
    if (!nonce && !hash) {
      return;
    }

    return transactions.find((transaction) => {
      if (isSubmittedOrder(transaction)) {
        return transaction.order.nonce === nonce;
      }

      return transaction.hash === hash;
    });
  }, [transactions, nonce, hash]);
};

export default useOrderTransaction;
