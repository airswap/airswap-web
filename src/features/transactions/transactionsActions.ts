import { createAction } from "@reduxjs/toolkit";

import {
  SubmittedOrderUnderConsideration,
  SubmittedTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";

export const submitTransaction = createAction<
  SubmittedTransaction | SubmittedOrderUnderConsideration
>("transaction/submitTransaction");

export const declineTransaction = createAction<{
  hash?: string;
  signerWallet?: string;
  nonce?: string;
  reason?: string;
}>("transactions/declineTransaction");

export const revertTransaction = createAction<{
  hash?: string;
  signerWallet?: string;
  nonce?: string;
  reason?: string;
}>("transactions/revertTransaction");

export const updateTransactions = createAction<SubmittedTransaction[]>(
  "transactions/updateTransactions"
);
