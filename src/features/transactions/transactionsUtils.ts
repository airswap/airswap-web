import { SwapERC20__factory } from "@airswap/swap-erc20/typechain/factories/contracts";
import { Wrapper__factory } from "@airswap/wrapper/typechain/factories/contracts";
import { Interface } from "@ethersproject/abi";
import { BaseProvider, TransactionReceipt } from "@ethersproject/providers";
import { Web3Provider } from "@ethersproject/providers";
import { Action, Dispatch } from "@reduxjs/toolkit";

import { Event as EthersEvent, BigNumber as EthersBigNumber } from "ethers";

import { AppDispatch } from "../../app/store";
import {
  StatusType,
  SubmittedTransaction,
  SubmittedTransactionWithOrder,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  isApprovalTransaction,
  isDepositTransaction,
  isLastLookOrderTransaction,
  isRfqOrderTransaction,
  isWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { parseJsonArray } from "../../helpers/array";
import {
  handleApproveTransaction,
  handleSubmittedDepositOrder,
  handleSubmittedRFQOrder,
  handleSubmittedWithdrawOrder,
} from "../orders/ordersActions";
import { mineTransaction, revertTransaction } from "./transactionsActions";
import { updateTransaction } from "./transactionsHelpers";

const swapInterface = new Interface(SwapERC20__factory.abi);

// Event from interface for reference.
// event Swap(
//   uint256 indexed nonce,
//   address indexed signerWallet,
//   address signerToken,
//   uint256 signerAmount,
//   uint256 protocolFee,
//   address indexed senderWallet,
//   address senderToken,
//   uint256 senderAmount
// );

export type SwapEventArgs = {
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

const getSwapArgsFromWrappedSwapForLog: (
  log: EthersEvent
) => Promise<SwapEventArgs> = async (log: EthersEvent) => {
  const receipt = await log.getTransactionReceipt();
  // Find the `Swap` log that must have been emitted too.
  for (let i = 0; i < receipt.logs.length; i++) {
    try {
      const parsedLog = swapInterface.parseLog(receipt.logs[i]);
      if (parsedLog.name === "SwapERC20") {
        return parsedLog.args as unknown as SwapEventArgs;
      }
    } catch (e) {
      // Most likely trying to decode logs from other contract, e.g. ERC20
      // We can ignore the error and check the next log.
      continue;
    }
  }
  throw new Error(
    `Could not find Swap event in tx with hash: ${log.transactionHash}`
  );
};

/**
 * if pending, call getTransaction to see if it was a success/failure/pending
 * update accordingly. if pending: wait() and poll at a sensible interval.
 * this is only good for request-for-quote-erc20 orders
 * @param transactionInState
 * @param walletHasChanged
 * @param dispatch
 * @param library
 */
async function checkPendingTransactionState(
  transactionInState: SubmittedTransaction,
  dispatch: Dispatch<Action>,
  library: Web3Provider
) {
  try {
    if (transactionInState.status === "processing" && transactionInState.hash) {
      let receipt = await library.getTransactionReceipt(
        transactionInState.hash
      );
      if (receipt !== null) {
        const status = receipt.status;
        if (status === 1)
          dispatch(mineTransaction({ hash: transactionInState.hash }));
        // success
        else if (status === 0)
          dispatch(
            revertTransaction({
              hash: transactionInState.hash,
              reason: "Reverted",
            })
          ); // reverted
        return;
        // Orders will automatically be picked up by swapEventSubscriber
      } else if (transactionInState.type !== "Order") {
        // Receipt was null, so the transaction is incomplete
        // Try to get a reference to the transaction in the mem pool - this
        // can sometimes also return null (e.g. gas price too low or tx only
        // recently sent) depending on backend.
        const transaction = await library.getTransaction(
          transactionInState.hash
        );
        if (transaction) {
          try {
            await transaction.wait(1);
            dispatch(mineTransaction({ hash: transactionInState.hash })); // success
          } catch (err) {
            console.error(err);
            dispatch(
              revertTransaction({
                hash: transactionInState.hash,
                reason: "Reverted",
              })
            );
          }
          return;
        } else {
          // if transaction === null, we poll at intervals
          // assume failed after 30 mins
          const assumedFailureTime = Date.now() + 30 * 60 * 1000;
          while (receipt === null && Date.now() <= assumedFailureTime) {
            // wait 30 seconds
            await new Promise((res) => setTimeout(res, 30000));
            receipt = await library!.getTransactionReceipt(
              transactionInState.hash
            );
          }
          if (!receipt || receipt.status === 0) {
            dispatch(
              revertTransaction({
                hash: transactionInState.hash,
                reason: "Reverted",
              })
            );
          } else {
            dispatch(mineTransaction({ hash: transactionInState.hash })); // success
          }
        }
      }
    }
  } catch (e: any) {
    // If the network changes, calling functions on an old transaction will fail
    // but we no longer care because it's not for our chain.
    if (e?.code === "NETWORK_ERROR") return;
    throw e;
  }
}

const isTransactionWithOrder = (
  transaction: SubmittedTransaction
): transaction is SubmittedTransactionWithOrder => {
  return "order" in transaction;
};

export const getTransactionsFilterLocalStorageKey: (
  walletAddress: string,
  chainId: number
) => string = (walletAddress, chainId) =>
  `airswap/transactions/filterTimestamps/${walletAddress}/${chainId}`;

export const getTransactionsLocalStorageKey: (
  walletAddress: string,
  chainId: number
) => string = (walletAddress, chainId) =>
  `airswap/transactions-v2/${walletAddress}/${chainId}`;

export const getLocalStorageTransactions = (
  account: string,
  chainId: number
): SubmittedTransaction[] => {
  const key = getTransactionsLocalStorageKey(account, chainId);
  const value = localStorage.getItem(key);

  return value ? parseJsonArray<SubmittedTransaction>(value) : [];
};

export const setLocalStorageTransactions = (
  account: string,
  chainId: number,
  transactions: SubmittedTransaction[]
): void => {
  const key = getTransactionsLocalStorageKey(account, chainId);
  const prunedTransactions = transactions.slice(0, 20);

  localStorage.setItem(key, JSON.stringify(prunedTransactions));
};

export const filterTransactionByDate = (
  transaction: SubmittedTransaction,
  timestamp: number,
  status?: StatusType
) => {
  if (status && transaction.status !== status) {
    return true;
  }

  return transaction.timestamp > timestamp;
};

export const handleTransactionReceipt = (
  receipt: TransactionReceipt,
  transaction: SubmittedTransaction,
  dispatch: AppDispatch
): void => {
  console.log("---New Transaction---");
  console.log(receipt);
  console.log(transaction);

  dispatch(
    updateTransaction({
      ...transaction,
      status: receipt.status === 1 ? "succeeded" : "declined",
    })
  );

  if (isApprovalTransaction(transaction)) {
    handleApproveTransaction(transaction, receipt, dispatch);
  }

  if (isDepositTransaction(transaction)) {
    handleSubmittedDepositOrder(transaction, receipt, dispatch);
  }

  if (isWithdrawTransaction(transaction)) {
    handleSubmittedWithdrawOrder(transaction, receipt, dispatch);
  }

  if (
    isRfqOrderTransaction(transaction) ||
    isLastLookOrderTransaction(transaction)
  ) {
    handleSubmittedRFQOrder(transaction, receipt, dispatch);
  }
};

const getTransactionReceipt = async (
  hash: string,
  library: BaseProvider
): Promise<TransactionReceipt | undefined> => {
  try {
    const receipt = await library.getTransactionReceipt(hash);
    if (receipt?.status !== undefined) {
      return receipt;
    }

    return undefined;
  } catch {
    console.error("Error while fetching transaction receipt");

    return undefined;
  }
};

export const listenForTransactionReceipt = async (
  transaction: SubmittedTransaction,
  library: BaseProvider,
  dispatch: AppDispatch
): Promise<void> => {
  let hash = transaction.hash;

  if (isLastLookOrderTransaction(transaction)) {
    hash = transaction.order.nonce;
  }

  if (!hash) {
    console.error("Transaction hash is not found");

    return;
  }

  const receipt = await getTransactionReceipt(hash, library);

  if (receipt?.status !== undefined) {
    handleTransactionReceipt(receipt, transaction, dispatch);

    return;
  }

  library.once(hash, async () => {
    const receipt = await getTransactionReceipt(hash as string, library);

    if (receipt?.status !== undefined) {
      handleTransactionReceipt(receipt, transaction, dispatch);
    }
  });
};

export {
  getSwapArgsFromWrappedSwapForLog,
  checkPendingTransactionState,
  isTransactionWithOrder,
};
