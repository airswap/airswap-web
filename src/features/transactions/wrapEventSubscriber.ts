import { Dispatch } from "@reduxjs/toolkit";

import { Contract } from "ethers";

import { store } from "../../app/store";
import {
  decrementBalanceBy,
  incrementBalanceBy,
} from "../balances/balancesSlice";
import { SubmittedTransaction } from "./transactionsSlice";

const handleWrapEvent = (eventName: string, data: any, dispatch: any) => {
  const transactions = store.getState().transactions;

  let transaction: SubmittedTransaction | null =
    transactions.all.find((t: any) => t.hash === data[2].transactionHash) ||
    null;

  // If we don't have a 'transaction', we don't already know about this swap
  // and therefore don't need to update the UI.
  if (!transaction) return;

  dispatch(
    decrementBalanceBy({
      //@ts-ignore
      tokenAddress: transaction.order.senderToken,
      //@ts-ignore
      amount: transaction.order.senderAmount,
    })
  );
  dispatch(
    incrementBalanceBy({
      //@ts-ignore
      tokenAddress: transaction.order.signerToken,
      //@ts-ignore
      amount: transaction.order.senderAmount,
    })
  );
};

export default function subscribeToWrapEvents(params: {
  wrapContract: Contract;
  library: any;
  dispatch: Dispatch;
}) {
  const { wrapContract, dispatch } = params;
  wrapContract.on("Deposit", async (...data) =>
    handleWrapEvent("Deposit", data, dispatch)
  );
  wrapContract.on("Withdrawal", async (...data) =>
    handleWrapEvent("Withdrawal", data, dispatch)
  );
}
