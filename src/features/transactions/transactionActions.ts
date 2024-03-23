import { createAction } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../app/store";
import {
  ProtocolType,
  SubmittedApprovalTransaction,
  SubmittedTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { setTransactions } from "./transactionsSlice";

const submitTransaction = createAction<
  SubmittedTransaction | SubmittedApprovalTransaction
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

const expireTransaction = createAction<{
  signerWallet: string;
  nonce: string;
}>("transactions/expireTransaction");

const updateTransactions = createAction<SubmittedTransaction[]>(
  "transactions/updateTransactions"
);

const updateTransaction =
  (updatedTransaction: SubmittedTransaction) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const transactions = getState().transactions.all;
    const transactionIndex = transactions.findIndex(
      (transaction) => transaction.hash === updatedTransaction.hash
    );

    if (transactionIndex === -1) {
      return;
    }

    const updatedTransactions = [...transactions];
    updatedTransactions.splice(transactionIndex, 1, updatedTransaction);

    dispatch(updateTransactions(updatedTransactions));
  };

export {
  submitTransaction,
  declineTransaction,
  mineTransaction,
  revertTransaction,
  expireTransaction,
  updateTransaction,
  updateTransactions,
};
