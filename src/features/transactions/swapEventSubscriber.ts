import { Wrapper } from "@airswap/libraries";
import { Dispatch } from "@reduxjs/toolkit";

import { Contract, Event as EthersEvent } from "ethers";

import { store } from "../../app/store";
import { notifyTransaction } from "../../components/Toasts/ToastController";
import { mineTransaction } from "./transactionActions";
import {
  getSenderWalletForWrapperSwapLog,
  SwapEventArgs,
} from "./transactionUtils";
import { LastLookTransaction } from "./transactionsSlice";

export default function subscribeToSwapEvents(params: {
  swapContract: Contract;
  chainId: number;
  account: string;
  library: any;
  dispatch: Dispatch;
}) {
  const { swapContract, account, dispatch, chainId } = params;

  const _account = account.toLowerCase();
  const wrapperAddress = Wrapper.getAddress(chainId);

  const onSwap = async (...argsAndEvent: any[]) => {
    // Listeners are called with all args first, then an event object.
    const swapEvent: EthersEvent = argsAndEvent[argsAndEvent.length - 1];
    const args = swapEvent.args as unknown as SwapEventArgs;

    if (
      args.senderWallet.toLowerCase() !== _account &&
      args.signerWallet.toLowerCase() !== _account &&
      (args.senderWallet.toLowerCase() !== wrapperAddress.toLowerCase() ||
        (await getSenderWalletForWrapperSwapLog(swapEvent)) !== _account)
    ) {
      // Ignore events that don't involve us.
      return;
    }

    dispatch(
      mineTransaction({
        signerWallet: args.signerWallet,
        nonce: args.nonce.toString(),
        hash: swapEvent.transactionHash,
        protocol:
          args.signerWallet.toLowerCase() === _account
            ? "last-look-erc20"
            : "request-for-quote-erc20",
      })
    );

    const transactions = store.getState().transactions;

    const matchingTransaction = transactions.all.find((tx) => {
      if (tx.protocol === "last-look-erc20") {
        // Last look transactions don't have a nonce, but the
        const llTransaction = tx as LastLookTransaction;
        return (
          llTransaction.order.nonce === args.nonce.toString() &&
          llTransaction.order.signerWallet.toLowerCase() === _account
        );
      } else {
        // rfq transactions will have a hash
        return tx.hash === swapEvent.transactionHash;
      }
    });

    if (matchingTransaction) {
      notifyTransaction(
        "Order",
        matchingTransaction,
        Object.values(store.getState().metadata.tokens.all),
        false,
        chainId
      );
    }
  };
  swapContract.on("SwapERC20", onSwap);
}
