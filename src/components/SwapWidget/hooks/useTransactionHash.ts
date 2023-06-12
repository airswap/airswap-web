import React from "react";

interface UseBlockExplorerLinkProps {
  ordersStatus:
    | "reset"
    | "idle"
    | "failed"
    | "requesting"
    | "approving"
    | "taking";
  transactions: any;
}
/**
 *
 * @remarks
 * @returns
 */
const useTransactionHash = ({
  ordersStatus,
  transactions,
}: UseBlockExplorerLinkProps): string | undefined => {
  let orderCreated = false;
  let hash = undefined;
  let lastTransaction = transactions[0];

  if (ordersStatus === "approving") {
    orderCreated = true;
  }

  console.log(ordersStatus, lastTransaction);

  if (orderCreated && lastTransaction.status === "succeeded") {
    hash = lastTransaction.hash;
    return hash;
  }

  return undefined;
};

export default useTransactionHash;
