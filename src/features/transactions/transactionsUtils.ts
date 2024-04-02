import { BaseProvider, TransactionReceipt } from "@ethersproject/providers";

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
import { updateTransaction } from "./transactionsHelpers";

export const isTransactionWithOrder = (
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

  localStorage.setItem(key, JSON.stringify(transactions));
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

  // library.once(hash, async () => {
  //   const receipt = await getTransactionReceipt(hash as string, library);
  //
  //   if (receipt?.status !== undefined) {
  //     handleTransactionReceipt(receipt, transaction, dispatch);
  //   }
  // });
};
