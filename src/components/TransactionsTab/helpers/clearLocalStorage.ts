import { Dispatch } from "redux";
import { getTransactionsLocalStorageKey } from "../../../features/metadata/metadataApi";
import { clear, setTransactions, SubmittedTransaction } from "../../../features/transactions/transactionsSlice";

type ClearAllTransactionProps = {
  address: string,
  chainId: number,
  dispatch: Dispatch
}

type ClearFailedTransactionProps = {
  address: string,
  chainId: number,
  transactions: SubmittedTransaction[] | [],
  dispatch: Dispatch
}

export const clearAllTransactions = ({
  address,
  chainId,
  dispatch
}: ClearAllTransactionProps) => {
  dispatch(clear())

  const localStorageKey = getTransactionsLocalStorageKey(address, chainId)
  for (let key in localStorage) {
    if (key.includes(localStorageKey)) {
      localStorage?.removeItem(key)
    }
  }
};

export const clearFailedTransactions = ({
  address,
  chainId,
  transactions,
  dispatch
}: ClearFailedTransactionProps) => {
  if (transactions.length === 0) {
    return
  }

  const filteredTransactions = transactions.filter(transaction => transaction.status !== 'declined');
  dispatch(setTransactions({ all: filteredTransactions }))

  const localStorageKey = getTransactionsLocalStorageKey(address, chainId)

  for (let key in localStorage) {
    if (key.includes(localStorageKey)) {
      const keysWithTransactions = localStorage.getItem(key);
      if (keysWithTransactions) {
        const objectKeys = JSON.parse(keysWithTransactions);
        const orders = objectKeys.all;
        const filteredOrders = orders?.filter(
          (order: SubmittedTransaction) => order.status !== "declined"
        );
        const updatedKeys = JSON.stringify({ all: filteredOrders });
        localStorage?.setItem(key, updatedKeys);
      }
    }
  }

};

