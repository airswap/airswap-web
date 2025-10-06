import {
  FullOrder,
  FullOrderERC20,
  FullSwapERC20,
  OrderERC20,
  TokenInfo,
} from "@airswap/utils";
import { UnsignedOrderERC20 } from "@airswap/utils";

import {
  TransactionStatusType,
  TransactionTypes,
} from "../../types/transactionTypes";
import { AppTokenInfo } from "../AppTokenInfo/AppTokenInfo";
import { DelegateRule } from "../DelegateRule/DelegateRule";

export interface DepositOrWithdrawOrder {
  signerToken: string;
  signerAmount: string;
  senderToken: string;
  senderAmount: string;
}

export interface SubmittedTransaction {
  type: TransactionTypes;
  hash?: string;
  status: TransactionStatusType;
  timestamp: number;
}

export interface SubmittedTransactionWithHash extends SubmittedTransaction {
  hash: string;
}

export interface SubmittedOrder extends SubmittedTransactionWithHash {
  isLastLook?: boolean;
  type: TransactionTypes.order;
  order: OrderERC20 | FullOrderERC20 | FullOrder;
  swap?: FullSwapERC20;
  senderToken: AppTokenInfo;
  signerToken: AppTokenInfo;
}

export interface SubmittedOrderUnderConsideration
  extends Omit<SubmittedOrder, "hash"> {
  isLastLook: true;
}

export interface SubmittedLastLookOrder extends SubmittedOrder {
  isLastLook: true;
}

export interface SubmittedApprovalTransaction
  extends SubmittedTransactionWithHash {
  type: TransactionTypes.approval;
  hash: string;
  amount: string;
  token: AppTokenInfo;
  tokenAddress: string;
}

export interface SubmittedCancellation extends SubmittedTransactionWithHash {
  type: TransactionTypes.cancel;
  hash: string;
  nonce: string;
}

export interface SubmittedDepositTransaction
  extends SubmittedTransactionWithHash {
  type: TransactionTypes.deposit;
  hash: string;
  order: DepositOrWithdrawOrder;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}

export interface SubmittedWithdrawTransaction
  extends SubmittedTransactionWithHash {
  type: TransactionTypes.withdraw;
  hash: string;
  order: DepositOrWithdrawOrder;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}

export interface SubmittedSetRuleTransaction
  extends SubmittedTransactionWithHash {
  type: TransactionTypes.setDelegateRule;
  rule: DelegateRule;
  signerToken: TokenInfo;
  senderToken: TokenInfo;
}

export interface SubmittedUnsetRuleTransaction
  extends SubmittedTransactionWithHash {
  type: TransactionTypes.unsetRule;
  id: string;
  // True when a delegate rule is set after the timestamp of the transaction
  isOverridden: boolean;
  chainId: number;
  senderWallet: string;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}

export interface SubmittedDelegatedSwapTransaction
  extends SubmittedTransactionWithHash {
  type: TransactionTypes.delegatedSwap;
  delegateRule: DelegateRule;
  order: UnsignedOrderERC20;
  senderToken: TokenInfo;
  signerToken: TokenInfo;
}
