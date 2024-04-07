import { createAction } from "@reduxjs/toolkit";

import {
  ProtocolType,
  SubmittedApprovalTransaction,
  SubmittedTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";

export const submitTransaction = createAction<
  SubmittedTransaction | SubmittedApprovalTransaction
>("transaction/submitTransaction");

export const declineTransaction = createAction<{
  hash?: string;
  signerWallet?: string;
  nonce?: string;
  reason?: string;
  protocol?: ProtocolType;
}>("transactions/declineTransaction");

export const revertTransaction = createAction<{
  hash?: string;
  signerWallet?: string;
  nonce?: string;
  reason?: string;
}>("transactions/revertTransaction");

export const expireTransaction = createAction<{
  signerWallet: string;
  nonce: string;
}>("transactions/expireTransaction");

export const updateTransactions = createAction<SubmittedTransaction[]>(
  "transactions/updateTransactions"
);
