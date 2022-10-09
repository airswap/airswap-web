import { useMemo } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../app/hooks";
import { selectPendingCancellations } from "../features/transactions/transactionsSlice";

const useCancellationPending = (nonce: string | null): boolean => {
  const { chainId } = useWeb3React<Web3Provider>();
  const pendingCancellations = useAppSelector(selectPendingCancellations);

  return useMemo(() => {
    if (!nonce) {
      return false;
    }

    return pendingCancellations.some((tx) => tx.nonce === nonce);
  }, [nonce, pendingCancellations, chainId]);
};

export default useCancellationPending;
