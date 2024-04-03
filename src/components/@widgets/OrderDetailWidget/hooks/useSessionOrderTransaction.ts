import { useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../../../../app/hooks";
import { SubmittedTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransaction";
import { selectOrderTransactions } from "../../../../features/transactions/transactionsSlice";
import { TransactionStatusType } from "../../../../types/transactionType";

// This hook is very similar to useOrderTransaction but it will only return transactions that have been added since the component was mounted.

const useSessionOrderTransaction = (
  nonce: string
): SubmittedTransaction | undefined => {
  const transactions = useAppSelector(selectOrderTransactions);

  const [processingTransactionHash, setProcessingTransactionHash] =
    useState<string>();

  useEffect(() => {
    if (!transactions.length || processingTransactionHash) {
      return;
    }

    if (
      transactions[0].nonce === nonce &&
      transactions[0].status === TransactionStatusType.processing
    ) {
      setProcessingTransactionHash(transactions[0].hash);
    }
  }, [transactions]);

  return useMemo(() => {
    if (!processingTransactionHash) {
      return undefined;
    }

    return transactions.find(
      (transaction) => transaction.hash === processingTransactionHash
    );
  }, [processingTransactionHash, transactions]);
};

export default useSessionOrderTransaction;
