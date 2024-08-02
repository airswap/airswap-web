export interface ApproveEvent {
  amount: string;
  name: "Approve";
  hash: string;
  spenderAddress: string;
  status?: number;
  tokenAddress: string;
}
