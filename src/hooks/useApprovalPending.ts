import { useMemo } from "react";

import { ADDRESS_ZERO } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../app/hooks";
import { SubmittedApprovalTransaction } from "../entities/SubmittedTransaction/SubmittedTransaction";
import { selectPendingApprovals } from "../features/transactions/transactionsSlice";
import getWethAddress from "../helpers/getWethAddress";

const useApprovalPending = (
  tokenAddress?: string | null
): SubmittedApprovalTransaction | undefined => {
  const { chainId } = useWeb3React<Web3Provider>();
  const pendingApprovals = useAppSelector(selectPendingApprovals);

  return useMemo(() => {
    if (!tokenAddress || !pendingApprovals.length || !chainId) {
      return undefined;
    }

    // ETH can't have approvals because it's not a token. So we default to WETH.
    const justifiedAddress =
      tokenAddress === ADDRESS_ZERO ? getWethAddress(chainId) : tokenAddress;

    return pendingApprovals.find((tx) => tx.tokenAddress === justifiedAddress);
  }, [tokenAddress, pendingApprovals, chainId]);
};

export default useApprovalPending;
