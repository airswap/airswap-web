import { useLocalStorageValue } from "@react-hookz/web/esm";
import { useWeb3React } from "@web3-react/core";

import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { getTransactionsLocalStorageKey } from "./transactionUtils";

const useTransactionsFromLocalStorage = () => {
  const { account, chainId } = useWeb3React();
  const [transactions, setTransactions, clearTransactions] =
    useLocalStorageValue<{ all: SubmittedTransaction[] }>(
      getTransactionsLocalStorageKey(account || "-", chainId || 1),
      { all: [] },
      { handleStorageEvent: false }
    );
  return {
    transactions,
    setTransactions,
    clearTransactions,
  };
};

export default useTransactionsFromLocalStorage;
