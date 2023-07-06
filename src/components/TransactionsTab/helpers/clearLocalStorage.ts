import { getTransactionsLocalStorageKey } from "../../../features/metadata/metadataApi";
import { SubmittedTransaction } from "../../../features/transactions/transactionsSlice";

export const clearFailedTransactions = (address: string, chainId: number) => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const localStorageKey = getTransactionsLocalStorageKey(address, chainId);
    if (key?.includes(localStorageKey)) {
      const keysWithTransactions = localStorage.getItem(key);
      if (keysWithTransactions) {
        const objectKeys = JSON.parse(keysWithTransactions);
        const orders = objectKeys.all;

        const filteredOrders = orders?.filter(
          (order: SubmittedTransaction) => order.status !== "declined"
        );

        const updatedKeys = JSON.stringify({ all: filteredOrders });
        localStorage.setItem(key, updatedKeys);
      }
    }
  }
};

export const clearAllTransactions = (address: string, chainId: number) => {
  const localStorageKey = getTransactionsLocalStorageKey(address, chainId);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.includes(localStorageKey)) {
      localStorage.removeItem(key);
    }
  }
};
