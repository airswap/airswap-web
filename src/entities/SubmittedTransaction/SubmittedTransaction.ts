import { OrderERC20 } from "@airswap/utils";

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
  order: OrderERC20;
}

export interface SubmittedRFQOrder extends SubmittedTransactionWithOrder {}

export interface SubmittedLastLookOrder extends SubmittedTransactionWithOrder {}

export interface LastLookTransaction
  extends SubmittedTransaction,
    SubmittedLastLookOrder {}

export interface RfqTransaction
  extends SubmittedTransaction,
    SubmittedRFQOrder {}

export interface SubmittedApproval extends SubmittedTransaction {
  tokenAddress: string;
}

export interface SubmittedCancellation extends SubmittedTransaction {}

export interface SubmittedDepositOrder extends SubmittedTransaction {
  order: DepositOrWithdrawOrder;
}

export interface SubmittedWithdrawOrder extends SubmittedTransaction {
  order: DepositOrWithdrawOrder;
}
