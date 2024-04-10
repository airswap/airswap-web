import { TransactionEvent } from "../../types/transactionTypes";
import {
  SubmittedOrder,
  SubmittedOrderUnderConsideration,
} from "../SubmittedTransaction/SubmittedTransaction";
import { isSubmittedOrder } from "../SubmittedTransaction/SubmittedTransactionHelpers";
import { FullSwapERC20Event } from "./FullSwapERC20Event";

export const isFullSwapERC20Event = (
  event: TransactionEvent
): event is FullSwapERC20Event =>
  typeof event === "object" && "name" in event && event.name === "Swap";

export const findMatchingOrderTransaction = (
  transaction: SubmittedOrder | SubmittedOrderUnderConsideration,
  event: FullSwapERC20Event
): boolean => {
  if (isSubmittedOrder(transaction) && transaction.hash === event.hash) {
    return true;
  }

  return transaction.order.nonce === event.swap.nonce;
};
