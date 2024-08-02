import { useMemo } from "react";

import { useAppSelector } from "../app/hooks";
import {
  selectApprovals,
  selectCancellations,
} from "../features/transactions/transactionsSlice";
import { TransactionStatusType } from "../types/transactionTypes";

const useApprovalSuccess = (hash?: string): boolean => {
  const approvalTransactions = useAppSelector(selectApprovals);

  const transaction = useMemo(() => {
    if (!hash) {
      return undefined;
    }

    return approvalTransactions.find(
      (transaction) => transaction.hash === hash
    );
  }, [hash, approvalTransactions]);

  return transaction?.status === TransactionStatusType.succeeded;
};

export default useApprovalSuccess;
