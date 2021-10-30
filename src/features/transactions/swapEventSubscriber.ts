// @ts-ignore
import lightDeploys from "@airswap/light/deploys.js";
import { Dispatch } from "@reduxjs/toolkit";

import { Contract, ethers } from "ethers";

import { store } from "../../app/store";
import { notifyTransaction } from "../../components/Toasts/ToastController";
import { mineTransaction } from "./transactionActions";

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
  const handleReceipt = (
    tx: any,
    protocol: "last-look" | "request-for-quote"
  ) => {
    const tokens = Object.values(store.getState().metadata.tokens.all);
    const nonce = parseInt(tx.topics[1]);
    let transaction;
    store
      .getState()
      .transactions.all.forEach((t: any) => console.debug(t.nonce, t.hash));
    if (protocol === "request-for-quote")
      transaction = store
        .getState()
        .transactions.all.filter((t: any) => t.hash === tx.transactionHash)[0];
    else
      transaction = store
        .getState()
        .transactions.all.filter((t: any) => parseInt(t.nonce) === nonce)[0];
    dispatch(
      mineTransaction({
        signerWallet: account.toString(),
        nonce: nonce.toString(),
        hash: tx.transactionHash,
        protocol,
      })
    );
    if (transaction)
      notifyTransaction(
        "Order",
        //@ts-ignore
        transaction,
        tokens,
        false,
        chainId
      );
  };
  if (lightContract) {
    const lastlookFilter = {
      address: lightDeploys[chainId],
      topics: [lightContract.Swap, null, ethers.utils.hexZeroPad(account, 32)],
    };
    const rfqFilter = {
      address: lightDeploys[chainId],
      topics: [
        lightContract.Swap,
        null,
        null,
        ethers.utils.hexZeroPad(account, 32),
      ],
    };
    lightContract.on(rfqFilter, async (tx: any) =>
      handleReceipt(tx, "request-for-quote")
    );
    lightContract.on(lastlookFilter, async (tx: any) =>
      handleReceipt(tx, "last-look")
    );
  }
}
