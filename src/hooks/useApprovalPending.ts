import { useEffect, useMemo, useState } from "react";

import { ADDRESS_ZERO } from "@airswap/utils";

import { useAppSelector } from "../app/hooks";
import { SubmittedApprovalTransaction } from "../entities/SubmittedTransaction/SubmittedTransaction";
import {
  selectApprovals,
  selectPendingApprovals,
} from "../features/transactions/transactionsSlice";
import getWethAddress from "../helpers/getWethAddress";
import useDebounce from "./useDebounce";

//* Will return the pending approval if it exists, and optionally the resolved approval for 2 seconds (for the transaction overlay).
const useApprovalPending = (
  tokenAddress?: string | null,
  showResolvedApproval = false
): SubmittedApprovalTransaction | undefined => {
  const { chainId } = useAppSelector((state) => state.web3);
  const [debouncedApproval, setDebouncedApproval] = useState<
    SubmittedApprovalTransaction | undefined
  >(undefined);

  const pendingApprovals = useAppSelector(selectPendingApprovals);
  const allApprovals = useAppSelector(selectApprovals);

  const pendingApproval = useMemo(() => {
    if (!tokenAddress || !pendingApprovals.length || !chainId) {
      return undefined;
    }

    // ETH can't have approvals because it's not a token. So we default to WETH.
    const justifiedAddress =
      tokenAddress === ADDRESS_ZERO ? getWethAddress(chainId) : tokenAddress;

    return pendingApprovals.find((tx) => tx.tokenAddress === justifiedAddress);
  }, [tokenAddress, pendingApprovals, chainId]);

  const resolvedApproval = useMemo(() => {
    if (debouncedApproval) {
      return allApprovals.find((tx) => tx.hash === debouncedApproval.hash);
    }

    return undefined;
  }, [debouncedApproval, allApprovals]);

  useEffect(() => {
    if (pendingApproval) {
      setDebouncedApproval(pendingApproval);
    }
  }, [pendingApproval]);

  useDebounce(
    () => {
      if (pendingApproval === undefined) {
        setDebouncedApproval(undefined);
      }
    },
    3000,
    [pendingApproval]
  );

  return (
    pendingApproval || (showResolvedApproval ? resolvedApproval : undefined)
  );
};

export default useApprovalPending;
