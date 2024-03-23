import { OrderERC20, TokenInfo } from "@airswap/utils";

import {
  StatusType,
  SubmittedApprovalTransaction,
  SubmittedDepositTransaction,
  SubmittedRFQOrder,
  SubmittedWithdrawTransaction,
} from "./SubmittedTransaction";

export const transformToSubmittedApprovalTransaction = (
  hash: string,
  token: TokenInfo,
  amount: string,
  status: StatusType = "processing"
): SubmittedApprovalTransaction => {
  return {
    type: "Approval",
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
  status: StatusType = "processing"
): SubmittedDepositTransaction => {
  return {
    type: "Deposit",
    order: {
      signerAmount: amount,
      signerToken: nativeToken,
      senderAmount: amount,
      senderToken: wrappedToken,
    },
    hash,
    status,
    timestamp: Date.now(),
  };
};

export const transformToSubmittedWithdrawTransaction = (
  hash: string,
  wrappedToken: TokenInfo,
  nativeToken: TokenInfo,
  amount: string,
  status: StatusType = "processing"
): SubmittedWithdrawTransaction => {
  return {
    type: "Withdraw",
    order: {
      signerAmount: amount,
      signerToken: wrappedToken,
      senderAmount: amount,
      senderToken: nativeToken,
    },
    hash,
    status,
    timestamp: Date.now(),
  };
};

export const transformToSubmittedRFQOrder = (
  hash: string,
  order: OrderERC20,
  status: StatusType = "processing"
): SubmittedRFQOrder => {
  return {
    type: "Order",
    order,
    protocol: "request-for-quote-erc20",
    hash: hash,
    status,
    timestamp: Date.now(),
    nonce: order.nonce,
    expiry: order.expiry,
  };
};
