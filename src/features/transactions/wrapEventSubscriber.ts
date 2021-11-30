import { Web3Provider } from "@ethersproject/providers";
import { Dispatch } from "@reduxjs/toolkit";

import { Contract } from "ethers";

import { store } from "../../app/store";
import {
  decrementBalanceBy,
  incrementBalanceBy,
} from "../balances/balancesSlice";
import { SubmittedTransactionWithOrder } from "./transactionsSlice";

const handleWrapEvent = (data: any, dispatch: any) => {
  const transactions = store.getState().transactions;

  const transaction: SubmittedTransactionWithOrder | null =
    (transactions.all.find(
      (t: any) => t.hash === data[2].transactionHash
    ) as SubmittedTransactionWithOrder) || null;

  // If we don't have a 'transaction', we don't already know about this swap
  // and therefore don't need to update the UI.
  if (!transaction) return;

  dispatch(
    decrementBalanceBy({
      tokenAddress: transaction.order.senderToken,
      amount: transaction.order.senderAmount,
    })
  );
  dispatch(
    incrementBalanceBy({
      tokenAddress: transaction.order.signerToken,
      amount: transaction.order.senderAmount,
    })
  );
};

export default function subscribeToWrapEvents(params: {
  wrapContract: Contract;
  library: Web3Provider;
  dispatch: Dispatch;
}) {
  const { wrapContract, dispatch } = params;
  wrapContract.on("Deposit", async (...data) =>
    handleWrapEvent(data, dispatch)
  );
  wrapContract.on("Withdrawal", async (...data) =>
    handleWrapEvent(data, dispatch)
  );
}
