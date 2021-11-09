import { createAction } from "@reduxjs/toolkit";

import {
  SubmittedTransaction,
  SubmittedApproval,
  ProtocolType,
} from "./transactionsSlice";

const submitTransaction = createAction<
  SubmittedTransaction | SubmittedApproval
>("transaction/submitTransaction");

const declineTransaction = createAction<{
  hash?: string;
  signerWallet?: string;
  nonce?: string;
  reason?: string;
  protocol?: ProtocolType;
}>("transactions/declineTransaction");

const mineTransaction = createAction<{
  protocol?: ProtocolType;
  signerWallet?: string;
  hash?: string;
  nonce?: string;
}>("transaction/mineTransaction");

const revertTransaction = createAction<{
  hash?: string;
  signerWallet?: string;
  nonce?: string;
  reason?: string;
}>("transactions/revertTransaction");

export {
  submitTransaction,
  declineTransaction,
  mineTransaction,
  revertTransaction,
};
