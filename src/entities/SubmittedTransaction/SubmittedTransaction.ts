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
  timestamp: number;
}

export interface SubmittedOrder extends SubmittedTransaction {
  isLastLook?: boolean;
  type: TransactionTypes.order;
  order: OrderERC20;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}

export interface SubmittedOrderUnderConsideration
  extends Omit<SubmittedOrder, "hash"> {
  isLastLook: true;
}

export interface SubmittedLastLookOrder extends SubmittedOrder {
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
  nonce: string;
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
