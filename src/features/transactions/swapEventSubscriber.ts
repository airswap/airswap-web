import { Dispatch } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";
import { Contract } from "ethers";

import { store } from "../../app/store";
import { notifyTransaction } from "../../components/Toasts/ToastController";
import { mineTransaction } from "./transactionActions";
import {
  LastLookTransaction,
  SubmittedOrder,
  SubmittedTransaction,
  TransactionsState,
} from "./transactionsSlice";

const handleReceipt = ({
  nonce,
  transactionHash,
  signerWallet,
  transaction,
  protocol,
  chainId,
  dispatch,
}: {
  nonce: string;
  transactionHash: string;
  signerWallet: string;
  transaction: any;
  protocol: "last-look" | "request-for-quote" | undefined;
  chainId: number;
  dispatch: any;
}) => {
  const tokens = Object.values(store.getState().metadata.tokens.all);

  dispatch(
    mineTransaction({
      signerWallet: signerWallet,
      nonce: nonce,
      hash: transactionHash,
      protocol,
    })
  );

  notifyTransaction("Order", transaction, tokens, false, chainId);
};

type SwapHex = {
  _hex?: BigNumber;
  _isBigNumber: boolean;
};
type SwapEvent = {
  transactionHash: string;
  address: string;
  removed: boolean;
  eventSignature: string;
  topics: string[];
};

export type SwapRow = string | SwapHex | SwapEvent;

function isSwapHex(data: SwapRow): data is SwapHex {
  return (data as SwapHex)._isBigNumber !== undefined;
}

function isSwapEvent(data: SwapRow): data is SwapEvent {
  return (data as SwapEvent).transactionHash !== undefined;
}
function isSwapAddress(data: SwapRow): data is string {
  return typeof data === "string";
}

export const mapSwapEvent = (
  data: SwapRow[],
  chainId: number,
  account: string,
  transactions: TransactionsState
) => {
  let protocol: "request-for-quote" | "last-look" | undefined;
  const nonce = isSwapHex(data[0]) ? data[0].toString() : "UNKNOWN";
  let signerWallet = isSwapAddress(data[2]) ? data[2] : "";
  const transactionHash = isSwapEvent(data[9]) ? data[9].transactionHash : "";

  // First search for the transaction in our pending state by hash.
  // This will match either direct RFQ orders (senderWallet === account) or
  // RFQ orders going through the wrapper (senderWallet === wrapper).
  let transaction: SubmittedTransaction | null =
    transactions.all.find((t: any) => t.hash === transactionHash) || null;

  // If we haven't got a transaction with this hash in our history, then it's
  // either a last look order (if we're the signer) OR it's someone else's
  // swap. (Someone else includes "us" in another browser).
  if (!transaction && signerWallet.toLowerCase() === account.toLowerCase()) {
    transaction = transactions.all.find(
      (t: SubmittedTransaction | SubmittedOrder) =>
        t.nonce === nonce &&
        (t as SubmittedOrder).order?.signerWallet.toLowerCase() ===
          signerWallet.toLowerCase()
    ) as LastLookTransaction;
  }

  if (transaction) protocol = transaction.protocol;

  return {
    signerWallet,
    nonce,
    transactionHash,
    protocol,
    transaction,
  };
};

export default function subscribeToSwapEvents(params: {
  lightContract: Contract;
  chainId: number;
  account: string;
  library: any;
  dispatch: Dispatch;
}) {
  const { lightContract, account, dispatch, chainId } = params;
  console.debug(
    Date.now() + ": subscribed to swapEventSubscriber for ",
    account
  );

  lightContract.on("Swap", async (...data) => {
    const transactions = store.getState().transactions;
    const {
      nonce,
      signerWallet,
      transactionHash,
      protocol,
      transaction,
    } = mapSwapEvent(data, chainId, account, transactions);

    // If we don't have a 'transaction', we don't already know about this swap
    // and therefore don't need to update the UI.
    if (!transaction) return;

    return handleReceipt({
      nonce,
      signerWallet,
      transactionHash,
      protocol,
      chainId,
      transaction,
      dispatch,
    });
  });
}
