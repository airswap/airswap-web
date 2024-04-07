import { OrderERC20, TokenInfo } from "@airswap/utils";

import {
  TransactionStatusType,
  TransactionTypes,
} from "../../types/transactionTypes";

export interface DepositOrWithdrawOrder {
  signerToken: string;
  signerAmount: string;
  senderToken: string;
  senderAmount: string;
}

export interface SubmittedTransaction {
  type: TransactionTypes;
  hash?: string; // LL orders doesn't have hash
  status: TransactionStatusType;
  nonce?: string;
  expiry?: string;
  timestamp: number;
}

export interface SubmittedTransactionWithOrder extends SubmittedTransaction {
  isLastLook?: boolean;
  type: TransactionTypes.order;
  order: OrderERC20;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}

export interface SubmittedTransactionWithOrderUnderConsideration
  extends Omit<SubmittedTransactionWithOrder, "hash"> {
  isLastLook: true;
}

export interface SubmittedRFQOrder extends SubmittedTransactionWithOrder {
  protocol: "request-for-quote-erc20";
}

export interface SubmittedLastLookOrder extends SubmittedTransactionWithOrder {
  isLastLook: true;
}

export interface SubmittedApprovalTransaction extends SubmittedTransaction {
  type: TransactionTypes.approval;
  hash: string;
  amount: string;
  token: TokenInfo;
  tokenAddress: string;
}

export interface SubmittedCancellation extends SubmittedTransaction {
  hash: string;
}

export interface SubmittedDepositTransaction extends SubmittedTransaction {
  type: TransactionTypes.deposit;
  hash: string;
  order: DepositOrWithdrawOrder;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}

export interface SubmittedWithdrawTransaction extends SubmittedTransaction {
  type: TransactionTypes.withdraw;
  hash: string;
  order: DepositOrWithdrawOrder;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}
