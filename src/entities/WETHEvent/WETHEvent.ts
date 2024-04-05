import { WethEventType } from "../../types/wethEventType";

export interface WETHEvent {
  type: WethEventType;
  amount: string;
  name: "Deposit" | "Withdrawal";
  hash: string;
  status?: number;
}
