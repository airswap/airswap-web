import { useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../../../../app/hooks";
import { SubmittedTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransaction";
import { isDelegatedSwapTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { selectDelegateSwapTransactions } from "../../../../features/transactions/transactionsSlice";
import { TransactionStatusType } from "../../../../types/transactionTypes";

const useSessionDelegateSwapTransaction = (
  id: string
): { transaction: SubmittedTransaction | undefined; reset: () => void } => {
  const transactions = useAppSelector(selectDelegateSwapTransactions);

  const [processingTransactionHash, setProcessingTransactionHash] =
    useState<string>();

  useEffect(() => {
    if (!transactions.length || processingTransactionHash) {
      return;
    }

    if (
      isDelegatedSwapTransaction(transactions[0]) &&
      transactions[0].delegateRule.id === id &&
      transactions[0].status === TransactionStatusType.processing
    ) {
      setProcessingTransactionHash(transactions[0].hash);
    }
  }, [transactions]);

  const transaction = useMemo(() => {
    if (!processingTransactionHash) {
      return undefined;
    }

    return transactions.find(
      (transaction) => transaction.hash === processingTransactionHash
    );
  }, [processingTransactionHash, transactions]);

  return { transaction, reset: () => setProcessingTransactionHash(undefined) };
};

export default useSessionDelegateSwapTransaction;
