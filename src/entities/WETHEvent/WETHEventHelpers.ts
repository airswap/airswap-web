import { TransactionEvent } from "../../types/transactionTypes";
import {
  SubmittedDepositTransaction,
  SubmittedWithdrawTransaction,
} from "../SubmittedTransaction/SubmittedTransaction";
import { WETHEvent } from "./WETHEvent";

export const isWETHEvent = (event: TransactionEvent): event is WETHEvent =>
  typeof event === "object" &&
  "name" in event &&
  (event.name === "Deposit" || event.name === "Withdrawal");

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
