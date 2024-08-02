import { useAppSelector } from "../../../app/hooks";
import { selectPendingTransactions } from "../transactionsSlice";
import useLatestTransaction from "./useLatestTransaction";

const useLatestPendingTransaction = () => {
  const pendingTransactions = useAppSelector(selectPendingTransactions);

  return useLatestTransaction(pendingTransactions);
};

export default useLatestPendingTransaction;
