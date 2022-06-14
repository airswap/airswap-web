import { Wrapper } from "@airswap/libraries";
import * as WrapperContract from "@airswap/wrapper/build/contracts/Wrapper.sol/Wrapper.json";
import { Interface } from "@ethersproject/abi";
import { Dispatch } from "@reduxjs/toolkit";

import {
  Contract,
  Event as EthersEvent,
  BigNumber as EthersBigNumber,
} from "ethers";

import { store } from "../../app/store";
import { notifyTransaction } from "../../components/Toasts/ToastController";
import { mineTransaction } from "./transactionActions";
import { LastLookTransaction } from "./transactionsSlice";

// Event from interface for reference.
// event Swap(
//   uint256 indexed nonce,
//   uint256 timestamp,
//   address indexed signerWallet,
//   address signerToken,
//   uint256 signerAmount,
//   uint256 protocolFee,
//   address indexed senderWallet,
//   address senderToken,
//   uint256 senderAmount
// );

const wrapperInterface = new Interface(WrapperContract.abi);

type SwapEventArgs = {
  nonce: EthersBigNumber;
  timestamp: EthersBigNumber;
  signerWallet: string;
  signerToken: string;
  signerAmount: EthersBigNumber;
  protocolFee: EthersBigNumber;
  senderWallet: string;
  senderToken: string;
  senderAmount: EthersBigNumber;
};

export default function subscribeToSwapEvents(params: {
  swapContract: Contract;
  chainId: number;
  account: string;
  library: any;
  dispatch: Dispatch;
}) {
  const { swapContract, account, dispatch, chainId } = params;

  const _account = account.toLowerCase();
  const wrapperAddress = Wrapper.getAddress(chainId).toLowerCase();

  const onSwap = async (...argsAndEvent: any[]) => {
    // Listeners are called with all args first, then an event object.
    const swapEvent: EthersEvent = argsAndEvent[argsAndEvent.length - 1];
    const args = swapEvent.args as unknown as SwapEventArgs;

    if (
      args.senderWallet.toLowerCase() !== _account &&
      args.signerWallet.toLowerCase() !== _account
    ) {
      if (args.senderWallet.toLowerCase() === wrapperAddress) {
        // if swap was via the Wrapper (i.e. swapping to/from ETH & not WETH)
        // then the senderWallet will be the wrapper address, and there will
        // also be a `WrappedSwapFor` event emitted with a single address as arg

        // First get the transaction receipt so that we can inspect the logs.
        const receipt = await swapEvent.getTransactionReceipt();

        // Find the `WrappedSwapFor` log that must have been emitted too.
        for (let i = 0; i < receipt.logs.length; i++) {
          try {
            const parsedLog = wrapperInterface.parseLog(receipt.logs[0]);
            if (parsedLog.name === "WrappedSwapFor") {
              // Check if the sender is our account, otherwise disregard.
              if (parsedLog.args.senderWallet.toLowerCase() !== _account) {
                return;
              }
              break;
            }
          } catch (e) {
            // Most likely trying to decode logs from other contract, e.g. ERC20
            // We can ignore the error and check the next log.
            continue;
          }
        }
      } else {
        // Ignore events that don't involve us.
        return;
      }
    }

    dispatch(
      mineTransaction({
        signerWallet: args.signerWallet,
        nonce: args.nonce.toString(),
        hash: swapEvent.transactionHash,
        protocol:
          args.signerWallet.toLowerCase() === _account
            ? "last-look"
            : "request-for-quote",
      })
    );

    const transactions = store.getState().transactions;

    const matchingTransaction = transactions.all.find((tx) => {
      if (tx.protocol === "last-look") {
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
  swapContract.on("Swap", onSwap);
}
