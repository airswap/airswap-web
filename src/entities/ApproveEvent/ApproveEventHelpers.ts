import { SubmittedApprovalTransaction } from "../SubmittedTransaction/SubmittedTransaction";
import { ApproveEvent } from "./ApproveEvent";

export const isApproveEvent = (event: any): event is ApproveEvent =>
  typeof event === "object" &&
  "amount" in event &&
  "hash" in event &&
  "spenderAddress" in event &&
  "tokenAddress" in event;

export const findMatchingApprovalTransaction = (
  transaction: SubmittedApprovalTransaction,
  event: ApproveEvent
): boolean => {
  if (transaction.hash === event.hash) {
    return true;
  }

  // If hash doesn't match, check if the token address and amount match, it's safely to assume
  // the transaction was replaced
  return (
    transaction.tokenAddress === event.tokenAddress &&
    transaction.amount === event.amount
  );
};
