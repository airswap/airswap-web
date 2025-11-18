import { useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../../../../app/hooks";
import { DelegateRule } from "../../../../entities/DelegateRule/DelegateRule";
import { SubmittedUnsetRuleTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransaction";
import { isUnsetRuleTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import {
  selectPendingUnsetRuleTransactions,
  selectUnsetRuleTransactions,
} from "../../../../features/transactions/transactionsSlice";
import { compareAddresses } from "../../../../helpers/string";
import useDebounce from "../../../../hooks/useDebounce";

//* Will return the pending unset rule transaction if it exists, and optionally the resolved unset rule transaction for 3 seconds (for the transaction overlay).
const useRuleUnsetPending = (
  delegateRule?: DelegateRule,
  showResolvedUnsetRuleTransaction = false
): SubmittedUnsetRuleTransaction | undefined => {
  const { chainId } = useAppSelector((state) => state.web3);
  const [debouncedUnsetRuleTransaction, setDebouncedUnsetRuleTransaction] =
    useState<SubmittedUnsetRuleTransaction | undefined>(undefined);

  const pendingUnsetRuleTransactions = useAppSelector(
    selectPendingUnsetRuleTransactions
  );
  const allUnsetRuleTransactions = useAppSelector(selectUnsetRuleTransactions);

  const pendingUnsetRuleTransaction = useMemo(() => {
    if (!delegateRule || !pendingUnsetRuleTransactions.length || !chainId) {
      return undefined;
    }

    return pendingUnsetRuleTransactions.find((tx) => {
      return (
        isUnsetRuleTransaction(tx) &&
        compareAddresses(tx.senderToken.address, delegateRule.senderToken) &&
        compareAddresses(tx.signerToken.address, delegateRule.signerToken) &&
        compareAddresses(tx.senderWallet, delegateRule.senderWallet)
      );
    });
  }, [delegateRule, pendingUnsetRuleTransactions, chainId]);

  const resolvedUnsetRuleTransaction = useMemo(() => {
    if (debouncedUnsetRuleTransaction) {
      return allUnsetRuleTransactions.find(
        (tx) => tx.hash === debouncedUnsetRuleTransaction.hash
      );
    }

    return undefined;
  }, [debouncedUnsetRuleTransaction, allUnsetRuleTransactions]);

  useEffect(() => {
    if (pendingUnsetRuleTransaction) {
      setDebouncedUnsetRuleTransaction(pendingUnsetRuleTransaction);
    }
  }, [pendingUnsetRuleTransaction]);

  useDebounce(
    () => {
      if (pendingUnsetRuleTransaction === undefined) {
        setDebouncedUnsetRuleTransaction(undefined);
      }
    },
    3000,
    [pendingUnsetRuleTransaction]
  );

  return (
    pendingUnsetRuleTransaction ||
    (showResolvedUnsetRuleTransaction
      ? resolvedUnsetRuleTransaction
      : undefined)
  );
};

export default useRuleUnsetPending;
