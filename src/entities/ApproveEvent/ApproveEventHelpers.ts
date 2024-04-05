import { TransactionEvent } from "../../types/transactionTypes";
import { SubmittedApprovalTransaction } from "../SubmittedTransaction/SubmittedTransaction";
import { ApproveEvent } from "./ApproveEvent";

export const isApproveEvent = (
  event: TransactionEvent
): event is ApproveEvent =>
  typeof event === "object" && "name" in event && event.name === "Approve";

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
