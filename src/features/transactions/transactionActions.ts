import { createAction } from "@reduxjs/toolkit";

import { SubmittedTransaction, SubmittedApproval } from "./transactionsSlice";

const submitTransaction = createAction<
  SubmittedTransaction | SubmittedApproval
>("transaction/submitTransaction");

const declineTransaction = createAction<{
  hash: string;
  reason: string;
}>("transactions/declineTransaction");

const mineTransaction = createAction<string>("transaction/mineTransaction");

const revertTransaction = createAction<{
  hash: string;
  reason: string;
}>("transactions/revertTransaction");

export {
  submitTransaction,
  declineTransaction,
  mineTransaction,
  revertTransaction,
};
