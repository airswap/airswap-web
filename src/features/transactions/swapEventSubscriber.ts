import { Dispatch } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";
import { Contract } from "ethers";

import { store } from "../../app/store";
import { notifyTransaction } from "../../components/Toasts/ToastController";
import { mineTransaction } from "./transactionActions";
import { TransactionsState } from "./transactionsSlice";

const handleReceipt = ({
  nonce,
  transactionHash,
  signerWallet,
  transaction,
  protocol,
  chainId,
  dispatch,
}: {
  nonce: number;
  transactionHash: string;
  signerWallet: string;
  transaction: any;
  protocol: "last-look" | "request-for-quote";
  chainId: number;
  dispatch: any;
}) => {
  const tokens = Object.values(store.getState().metadata.tokens.all);

  dispatch(
    mineTransaction({
      signerWallet: signerWallet,
      nonce: nonce.toString(),
      hash: transactionHash,
      protocol,
    })
  );

  notifyTransaction(
    "Order",
    //@ts-ignore
    transaction,
    tokens,
    false,
    chainId
  );
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
  let protocol: "request-for-quote" | "last-look" = "request-for-quote";
  const nonce = isSwapHex(data[0]) ? parseInt(data[0]._hex!.toString()) : 0;
  let signerWallet = isSwapAddress(data[6]) ? data[6] : "";
  const transactionHash = isSwapEvent(data[9]) ? data[9].transactionHash : "";

  let transaction = transactions.all.filter(
    (t: any) => t.hash === transactionHash
  )[0];
  if (transaction) {
    protocol = transaction.protocol!;
  } else {
    // most likely last-look, but check anyway
    if (signerWallet.toLowerCase() !== account.toLowerCase())
      protocol = "last-look";
    transaction = transactions.all.filter(
      (t: any) => parseInt(t.nonce) === nonce
    )[0];
    signerWallet = account;
  }

  return {
    signerWallet,
    nonce,
    transactionHash,
    protocol,
    transaction,
  };
};

export default function swapEventSubscriber(params: {
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
    if (nonce && signerWallet && transactionHash && protocol)
      return handleReceipt({
        nonce,
        signerWallet,
        transactionHash,
        protocol,
        chainId,
        transaction,
        dispatch,
      });
    else
      console.error("missing data", {
        nonce,
        signerWallet,
        transactionHash,
        protocol,
      });
  });
}
