import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../app/store";
import { ASSUMED_EXPIRY_NOTIFICATION_BUFFER_MS } from "../../constants/configParams";
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

export const mineTransaction = createAction<{
  protocol?: ProtocolType;
  signerWallet?: string;
  hash?: string;
  nonce?: string;
}>("transaction/mineTransaction");

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
