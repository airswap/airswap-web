import { WethEventType } from "../../types/wethEventType";

export interface WETHEvent {
  type: WethEventType;
  amount: string;
  hash: string;
  status?: number;
}
