import { getTransactionsLocalStorageKey } from "./transactionUtils";
import { SubmittedTransaction } from "./transactionsSlice";
import { useLocalStorageValue } from "@react-hookz/web/esm";
import { useWeb3React } from "@web3-react/core";

const useTransactionsFromLocalStorage = () => {
  const { account, chainId } = useWeb3React();
  const [transactions, setTransactions, clearTransactions] =
    useLocalStorageValue<{ all: SubmittedTransaction[] }>(
      getTransactionsLocalStorageKey(account || "-", chainId || 1),
      { all: [] },
      { handleStorageEvent: false },
    );
  return {
    transactions,
    setTransactions,
    clearTransactions,
  };
};

export default useTransactionsFromLocalStorage;
