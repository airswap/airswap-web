import React from "react";

import { SubmittedTransaction } from "../../../features/transactions/transactionsSlice";

interface UseBlockExplorerLinkProps {
  transactions: SubmittedTransaction[];
}
/**
 *
 * @returns transaction hash for Swap order if successful
 */
const useTransactionHash = ({
  transactions,
}: UseBlockExplorerLinkProps): string | undefined => {
  let lastTransaction = transactions[0];

  if (lastTransaction.status === "succeeded") {
    return lastTransaction.hash;
  } else {
    return undefined;
  }
};

export default useTransactionHash;
