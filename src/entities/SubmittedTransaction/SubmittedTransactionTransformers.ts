import {
  FullOrder,
  FullSwapERC20,
  OrderERC20,
  TokenInfo,
  UnsignedOrderERC20,
} from "@airswap/utils";

import {
  TransactionStatusType,
  TransactionTypes,
} from "../../types/transactionTypes";
import { AppTokenInfo } from "../AppTokenInfo/AppTokenInfo";
import { DelegateRule } from "../DelegateRule/DelegateRule";
import {
  SubmittedApprovalTransaction,
  SubmittedDelegatedSwapTransaction,
  SubmittedDepositTransaction,
  SubmittedOrder,
  SubmittedOrderUnderConsideration,
  SubmittedUnsetRuleTransaction,
  SubmittedWithdrawTransaction,
} from "./SubmittedTransaction";

export const transformToSubmittedApprovalTransaction = (
  hash: string,
  token: AppTokenInfo,
  amount: string,
  status: TransactionStatusType = TransactionStatusType.processing
): SubmittedApprovalTransaction => {
  return {
    type: TransactionTypes.approval,
    hash: hash,
    status,
    token,
    tokenAddress: token.address,
    amount,
    timestamp: Date.now(),
  };
};

export const transformToSubmittedDepositTransaction = (
  hash: string,
  wrappedToken: TokenInfo,
  nativeToken: TokenInfo,
  amount: string,
  status: TransactionStatusType = TransactionStatusType.processing
): SubmittedDepositTransaction => {
  return {
    type: TransactionTypes.deposit,
    order: {
      signerAmount: amount,
      signerToken: nativeToken.address,
      senderAmount: amount,
      senderToken: wrappedToken.address,
    },
    hash,
    status,
    signerToken: nativeToken,
    senderToken: wrappedToken,
    timestamp: Date.now(),
  };
};

export const transformToSubmittedWithdrawTransaction = (
  hash: string,
  wrappedToken: TokenInfo,
  nativeToken: TokenInfo,
  amount: string,
  status: TransactionStatusType = TransactionStatusType.processing
): SubmittedWithdrawTransaction => {
  return {
    type: TransactionTypes.withdraw,
    order: {
      signerAmount: amount,
      signerToken: wrappedToken.address,
      senderAmount: amount,
      senderToken: nativeToken.address,
    },
    hash,
    status,
    timestamp: Date.now(),
    signerToken: wrappedToken,
    senderToken: nativeToken,
  };
};

export const transformToSubmittedTransactionWithOrder = (
  hash: string,
  order: OrderERC20 | FullOrder,
  signerToken: AppTokenInfo,
  senderToken: AppTokenInfo,
  swap?: FullSwapERC20,
  status: TransactionStatusType = TransactionStatusType.processing,
  timestamp = Date.now()
): SubmittedOrder => ({
  type: TransactionTypes.order,
  hash,
  order,
  senderToken,
  signerToken,
  status,
  swap,
  timestamp,
});

export const transformToSubmittedTransactionWithOrderUnderConsideration = (
  order: OrderERC20,
  signerToken: TokenInfo,
  senderToken: TokenInfo,
  status: TransactionStatusType = TransactionStatusType.processing,
  timestamp = Date.now()
): SubmittedOrderUnderConsideration => ({
  isLastLook: true,
  type: TransactionTypes.order,
  order,
  senderToken,
  signerToken,
  status,
  timestamp,
});

export const transformToSubmittedDelegateSwapTransaction = (
  hash: string,
  order: UnsignedOrderERC20,
  delegateRule: DelegateRule,
  senderToken: TokenInfo,
  signerToken: TokenInfo,
  status: TransactionStatusType = TransactionStatusType.processing,
  timestamp = Date.now()
): SubmittedDelegatedSwapTransaction => ({
  type: TransactionTypes.delegatedSwap,
  hash,
  order,
  delegateRule,
  senderToken,
  signerToken,
  status,
  timestamp,
});

export const transformToSubmittedUnsetRuleTransaction = (
  hash: string,
  senderToken: TokenInfo,
  signerToken: TokenInfo,
  senderWallet: string,
  status: TransactionStatusType = TransactionStatusType.processing,
  timestamp = Date.now()
): SubmittedUnsetRuleTransaction => ({
  type: TransactionTypes.unsetRule,
  id: `${senderToken.chainId}-${senderWallet}-${senderToken.address}-${signerToken.address}`,
  isOverridden: false,
  hash,
  senderToken,
  signerToken,
  senderWallet,
  status,
  timestamp,
  chainId: senderToken.chainId,
});
