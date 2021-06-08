import { createAction } from "@reduxjs/toolkit";
import { SubmittedOrder } from './transactionsSlice'

const submitTransaction = createAction<SubmittedOrder>("transaction/submitTransaction");

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
