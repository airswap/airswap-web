import { WethEventType } from "../../types/wethEventType";
import { ApproveEvent } from "../ApproveEvent/ApproveEvent";
import {
  SubmittedApprovalTransaction,
  SubmittedDepositTransaction,
  SubmittedWithdrawTransaction,
} from "../SubmittedTransaction/SubmittedTransaction";
import { WETHEvent } from "./WETHEvent";

export const isWETHEvent = (event: any): event is WETHEvent =>
  typeof event === "object" &&
  "type" in event &&
  (event.type === WethEventType.deposit ||
    event.type === WethEventType.withdrawal) &&
  "amount" in event &&
  "hash" in event;

export const findMatchingDepositOrWithdrawTransaction = (
  transaction: SubmittedDepositTransaction | SubmittedWithdrawTransaction,
  event: WETHEvent
): boolean => {
  if (transaction.hash === event.hash) {
    return true;
  }

  // If hash doesn't match, check if the amount matches, it's safely to assume the transaction was replaced
  return transaction.order.signerAmount === event.amount;
};
