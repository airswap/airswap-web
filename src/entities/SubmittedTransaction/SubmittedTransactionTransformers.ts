import { OrderERC20, TokenInfo } from "@airswap/utils";

import {
  TransactionStatusType,
  TransactionTypes,
} from "../../types/transactionTypes";
import {
  SubmittedApprovalTransaction,
  SubmittedDepositTransaction,
  SubmittedLastLookOrder,
  SubmittedOrder,
  SubmittedOrderUnderConsideration,
  SubmittedWithdrawTransaction,
} from "./SubmittedTransaction";

export const transformToSubmittedApprovalTransaction = (
  hash: string,
  token: TokenInfo,
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
  order: OrderERC20,
  signerToken: TokenInfo,
  senderToken: TokenInfo,
  status: TransactionStatusType = TransactionStatusType.processing,
  timestamp = Date.now()
): SubmittedOrder => ({
  type: TransactionTypes.order,
  expiry: order.expiry,
  hash,
  nonce: order.nonce,
  order,
  senderToken,
  signerToken,
  status,
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
  expiry: order.expiry,
  nonce: order.nonce,
  order,
  senderToken,
  signerToken,
  status,
  timestamp,
});
