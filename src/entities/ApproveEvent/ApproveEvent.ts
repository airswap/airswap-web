export interface ApproveEvent {
  amount: string;
  hash: string;
  spenderAddress: string;
  status?: number;
  tokenAddress: string;
}
