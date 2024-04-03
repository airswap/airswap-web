import { OrderERC20, TokenInfo } from "@airswap/utils";

import {
  TransactionStatusType,
  TransactionType,
} from "../../types/transactionType";
import {
  SubmittedApprovalTransaction,
  SubmittedDepositTransaction,
  SubmittedLastLookOrder,
  SubmittedRFQOrder,
  SubmittedWithdrawTransaction,
} from "./SubmittedTransaction";

export const transformToSubmittedApprovalTransaction = (
  hash: string,
  token: TokenInfo,
  amount: string,
  status: TransactionStatusType = TransactionStatusType.processing
): SubmittedApprovalTransaction => {
  return {
    type: TransactionType.approval,
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
    type: TransactionType.deposit,
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
    type: TransactionType.withdraw,
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

export const transformToSubmittedRFQOrder = (
  hash: string,
  order: OrderERC20,
  signerToken: TokenInfo,
  senderToken: TokenInfo,
  status: TransactionStatusType = TransactionStatusType.processing,
  timestamp = Date.now()
): SubmittedRFQOrder => {
  return {
    type: TransactionType.order,
    expiry: order.expiry,
    hash,
    nonce: order.nonce,
    order,
    protocol: "request-for-quote-erc20",
    senderToken,
    signerToken,
    status,
    timestamp,
  };
};

export const transformToSubmittedLastLookOrder = (
  hash: string | undefined,
  order: OrderERC20,
  signerToken: TokenInfo,
  senderToken: TokenInfo,
  status: TransactionStatusType = TransactionStatusType.processing,
  timestamp = Date.now()
): SubmittedLastLookOrder => {
  return {
    type: TransactionType.order,
    expiry: order.expiry,
    hash,
    nonce: order.nonce,
    order,
    protocol: "last-look-erc20",
    senderToken,
    signerToken,
    status,
    timestamp,
  };
};
