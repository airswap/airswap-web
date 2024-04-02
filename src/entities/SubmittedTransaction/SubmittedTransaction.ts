import { OrderERC20, TokenInfo } from "@airswap/utils";

export interface DepositOrWithdrawOrder {
  signerToken: string;
  signerAmount: string;
  senderToken: string;
  senderAmount: string;
}

export type TransactionType =
  | "Approval"
  | "Order"
  | "Deposit"
  | "Withdraw"
  | "Cancel";

export type StatusType =
  | "processing"
  | "succeeded"
  | "reverted"
  | "declined"
  | "expired";

export type ProtocolType = "request-for-quote-erc20" | "last-look-erc20";

export interface SubmittedTransaction {
  type: TransactionType;
  hash?: string; // LL orders doesn't have hash
  status: StatusType;
  nonce?: string;
  expiry?: string;
  timestamp: number;
  protocol?: ProtocolType;
}

export interface SubmittedTransactionWithOrder extends SubmittedTransaction {
  type: "Order";
  order: OrderERC20;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}

export interface SubmittedRFQOrder extends SubmittedTransactionWithOrder {
  protocol: "request-for-quote-erc20";
}

export interface SubmittedLastLookOrder extends SubmittedTransactionWithOrder {
  protocol: "last-look-erc20";
}

export interface SubmittedApprovalTransaction extends SubmittedTransaction {
  type: "Approval";
  hash: string;
  amount: string;
  token: TokenInfo;
  tokenAddress: string;
}

export interface SubmittedCancellation extends SubmittedTransaction {
  hash: string;
}

export interface SubmittedDepositTransaction extends SubmittedTransaction {
  type: "Deposit";
  hash: string;
  order: DepositOrWithdrawOrder;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}

export interface SubmittedWithdrawTransaction extends SubmittedTransaction {
  type: "Withdraw";
  hash: string;
  order: DepositOrWithdrawOrder;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}
