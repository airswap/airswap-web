import { TransactionEvent } from "../../types/transactionTypes";
import { SubmittedCancellation } from "../SubmittedTransaction/SubmittedTransaction";
import { CancelEvent } from "./CancelEvent";

export const isCancelEvent = (event: TransactionEvent): event is CancelEvent =>
  typeof event === "object" && "name" in event && event.name === "Cancel";

export const findMatchingCancelTransaction = (
  transaction: SubmittedCancellation,
  event: CancelEvent
): boolean => {
  if (transaction.hash === event.hash) {
    return true;
  }

  return transaction.nonce === event.nonce;
};
