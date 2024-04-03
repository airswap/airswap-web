import { TransactionReceipt } from "@ethersproject/providers";
import { createAction } from "@reduxjs/toolkit";

import { AppDispatch, RootState } from "../../app/store";
import {
  ProtocolType,
  SubmittedApprovalTransaction,
  SubmittedTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { TransactionStatusType } from "../../types/transactionType";
import { updateTransaction } from "./transactionsHelpers";

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

export const updateTransactionWithReceipt =
  (transaction: SubmittedTransaction, receipt: TransactionReceipt) =>
  (dispatch: AppDispatch): void => {
    if (receipt?.status === undefined) {
      return;
    }

    const status =
      receipt.status === 1
        ? TransactionStatusType.succeeded
        : TransactionStatusType.failed;

    dispatch(
      updateTransaction({
        ...transaction,
        status,
      })
    );
  };
