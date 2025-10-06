import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import { SubmittedSetRuleTransaction } from "../entities/SubmittedTransaction/SubmittedTransaction";
import { isSetRuleTransaction } from "../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { selectTransactions } from "../features/transactions/transactionsSlice";

const useSetRuleTransaction = (
  hash?: string
): SubmittedSetRuleTransaction | undefined => {
  const transactions = useAppSelector(selectTransactions);

  return useMemo(() => {
    if (!hash) {
      return;
    }

    return transactions.find((transaction) => {
      return isSetRuleTransaction(transaction) && transaction.hash === hash;
    }) as SubmittedSetRuleTransaction | undefined;
  }, [transactions, hash]);
};

export default useSetRuleTransaction;
