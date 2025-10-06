import { useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../../../../app/hooks";
import { DelegateRule } from "../../../../entities/DelegateRule/DelegateRule";
import { SubmittedTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransaction";
import { isUnsetRuleTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { selectUnsetRuleTransactions } from "../../../../features/transactions/transactionsSlice";
import { compareAddresses } from "../../../../helpers/string";
import { TransactionStatusType } from "../../../../types/transactionTypes";

const useSessionUnsetRuleTransaction = (
  delegateRule: DelegateRule
): { transaction: SubmittedTransaction | undefined; reset: () => void } => {
  const transactions = useAppSelector(selectUnsetRuleTransactions);

  const [processingTransactionHash, setProcessingTransactionHash] =
    useState<string>();

  useEffect(() => {
    if (!transactions.length || processingTransactionHash) {
      return;
    }

    if (
      isUnsetRuleTransaction(transactions[0]) &&
      compareAddresses(
        transactions[0].senderToken.address,
        delegateRule.senderToken
      ) &&
      compareAddresses(
        transactions[0].senderWallet,
        delegateRule.senderWallet
      ) &&
      compareAddresses(
        transactions[0].signerToken.address,
        delegateRule.signerToken
      ) &&
      transactions[0].chainId === delegateRule.chainId &&
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

export default useSessionUnsetRuleTransaction;
