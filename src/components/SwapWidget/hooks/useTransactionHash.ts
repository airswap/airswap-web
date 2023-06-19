import { latest } from "immer/dist/internal";
import React from "react";

import { SubmittedTransaction } from "../../../features/transactions/transactionsSlice";

interface UseBlockExplorerLinkProps {
  transactions: SubmittedTransaction[];
  nonce: string | undefined;
}
/**
 *
 * @returns transaction hash for Swap order if successful
 */
const useTransactionHash = ({
  transactions,
  nonce,
}: UseBlockExplorerLinkProps): string | undefined => {
  const latestTransaction = transactions.filter((tx: SubmittedTransaction) => {
    return tx.nonce === nonce && tx.status === 'succeeded'
  })

  return latestTransaction ? latestTransaction[0]?.hash : undefined
};

export default useTransactionHash;
