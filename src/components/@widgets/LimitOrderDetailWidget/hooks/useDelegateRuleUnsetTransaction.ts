import { useMemo } from "react";

import { useAppSelector } from "../../../../app/hooks";
import { DelegateRule } from "../../../../entities/DelegateRule/DelegateRule";
import { selectUnsetRuleTransactions } from "../../../../features/transactions/transactionsSlice";
import { compareAddresses } from "../../../../helpers/string";

const useDelegateRuleUnsetTransaction = (delegateRule: DelegateRule) => {
  const transactions = useAppSelector(selectUnsetRuleTransactions);

  const transaction = useMemo(() => {
    return transactions.find(
      (transaction) =>
        compareAddresses(
          transaction.senderToken.address,
          delegateRule.senderToken
        ) &&
        compareAddresses(
          transaction.signerToken.address,
          delegateRule.signerToken
        ) &&
        compareAddresses(transaction.senderWallet, delegateRule.senderWallet) &&
        transaction.chainId === delegateRule.chainId &&
        !transaction.isOverridden
    );
  }, [transactions, delegateRule]);

  return transaction;
};

export default useDelegateRuleUnsetTransaction;
