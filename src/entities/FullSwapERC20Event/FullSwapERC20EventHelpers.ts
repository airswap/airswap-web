import { TransactionEvent } from "../../types/transactionTypes";
import { SubmittedOrder } from "../SubmittedTransaction/SubmittedTransaction";
import { FullSwapERC20Event } from "./FullSwapERC20Event";

export const isFullSwapERC20Event = (
  event: TransactionEvent
): event is FullSwapERC20Event =>
  typeof event === "object" && "name" in event && event.name === "Swap";

export const findMatchingOrderTransaction = (
  transaction: SubmittedOrder,
  event: FullSwapERC20Event
): boolean => {
  if (transaction.hash === event.hash) {
    return true;
  }

  return transaction.nonce === event.swap.nonce;
};
