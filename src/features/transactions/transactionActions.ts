import { LightOrder } from "@airswap/types";
import { createAction } from "@reduxjs/toolkit";

const submitTransaction = createAction<{
  order: LightOrder;
  hash: string;
}>("transaction/submitTransaction");

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
