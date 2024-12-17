import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";

import { useAppSelector } from "../app/hooks";
import { SubmittedDepositTransaction } from "../entities/SubmittedTransaction/SubmittedTransaction";
import {
  selectAllDeposits,
  selectPendingDeposits,
} from "../features/transactions/transactionsSlice";

//* Will return the pending deposit if it exists, and optionally the resolved deposit for 2 seconds (for the transaction overlay).
const useDepositPending = (
  showResolvedDeposit = false
): SubmittedDepositTransaction | undefined => {
  const pendingDeposits = useAppSelector(selectPendingDeposits);
  const allDeposits = useAppSelector(selectAllDeposits);

  const [debouncedDeposit, setDebouncedDeposit] = useState<
    SubmittedDepositTransaction | undefined
  >(undefined);

  const pendingDeposit = pendingDeposits.length
    ? pendingDeposits[0]
    : undefined;

  const resolvedDeposit = useMemo(() => {
    if (debouncedDeposit) {
      return allDeposits.find((tx) => tx.hash === debouncedDeposit.hash);
    }

    return undefined;
  }, [debouncedDeposit, allDeposits]);

  useEffect(() => {
    if (pendingDeposit) {
      setDebouncedDeposit(pendingDeposit);
    }
  }, [pendingDeposit]);

  useDebounce(
    () => {
      if (pendingDeposit === undefined) {
        setDebouncedDeposit(undefined);
      }
    },
    3000,
    [pendingDeposit]
  );

  return pendingDeposit || (showResolvedDeposit ? resolvedDeposit : undefined);
};

export default useDepositPending;
