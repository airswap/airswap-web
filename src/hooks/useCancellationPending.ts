import { useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../app/hooks";
import { SubmittedCancellation } from "../entities/SubmittedTransaction/SubmittedTransaction";
import {
  selectCancellations,
  selectPendingCancellations,
} from "../features/transactions/transactionsSlice";
import useDebounce from "./useDebounce";

//* Will return the pending cancellation if it exists, and optionally the resolved cancellation for 2 seconds (for the transaction overlay).
const useCancellationPending = (
  nonce: string | null,
  showResolvedCancellation = false
): SubmittedCancellation | undefined => {
  const pendingCancellations = useAppSelector(selectPendingCancellations);
  const allCancellations = useAppSelector(selectCancellations);

  const [debouncedCancellation, setDebouncedCancellation] = useState<
    SubmittedCancellation | undefined
  >(undefined);

  const pendingCancellation = useMemo(() => {
    return pendingCancellations.find((tx) => tx.nonce === nonce);
  }, [pendingCancellations]);

  const resolvedCancellation = useMemo(() => {
    if (debouncedCancellation) {
      return allCancellations.find(
        (tx) => tx.hash === debouncedCancellation.hash
      );
    }

    return undefined;
  }, [debouncedCancellation, allCancellations]);

  useEffect(() => {
    if (pendingCancellation) {
      setDebouncedCancellation(pendingCancellation);
    }
  }, [pendingCancellation]);

  useDebounce(
    () => {
      if (pendingCancellation === undefined) {
        setDebouncedCancellation(undefined);
      }
    },
    3000,
    [pendingCancellation]
  );

  return (
    pendingCancellation ||
    (showResolvedCancellation ? resolvedCancellation : undefined)
  );
};

export default useCancellationPending;
