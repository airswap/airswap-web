import { Wrapper } from "@airswap/libraries";
import { getFullSwapERC20 } from "@airswap/utils";
import { Dispatch } from "@reduxjs/toolkit";

import { BigNumber, Contract, Event as EthersEvent } from "ethers";

import { store } from "../../app/store";
import { notifyTransaction } from "../../components/Toasts/ToastController";
import { mineTransaction } from "./transactionActions";
import { getSenderWalletForWrapperSwapLog } from "./transactionUtils";
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
  const wrapperAddress = Wrapper.getAddress(chainId) || "";

  const onSwap = async (
    nonce: BigNumber,
    signerWallet: string,
    swapEvent: EthersEvent
  ) => {
    const fullArgs = await getFullSwapERC20(
      {
        nonce: nonce.toString(),
        signerWallet,
      },
      await swapEvent.getTransaction()
    );

    if (
      fullArgs.senderWallet.toLowerCase() !== _account &&
      fullArgs.signerWallet.toLowerCase() !== _account &&
      (fullArgs.senderWallet.toLowerCase() !== wrapperAddress.toLowerCase() ||
        (await getSenderWalletForWrapperSwapLog(swapEvent)) !== _account)
    ) {
      // Ignore events that don't involve us.
      return;
    }

    dispatch(
      mineTransaction({
        signerWallet,
        nonce: nonce.toString(),
        hash: swapEvent.transactionHash,
        protocol:
          signerWallet.toLowerCase() === _account
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
          llTransaction.order.nonce === nonce.toString() &&
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
