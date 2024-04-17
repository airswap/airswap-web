import { WethEventType } from "../../types/wethEventType";
import { WETHEvent } from "./WETHEvent";

export const transformToDepositOrWithdrawEvent = (
  type: WethEventType,
  amount: string,
  hash: string,
  status?: number
): WETHEvent => {
  return {
    type,
    amount,
    name: type === WethEventType.deposit ? "Deposit" : "Withdrawal",
    hash,
    status,
  };
};
