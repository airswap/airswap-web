import { useAppSelector } from "../../../app/hooks";
import { selectSuccessfulTransactions } from "../transactionsSlice";
import useLatestTransaction from "./useLatestTransaction";

const useLatestSucceededTransaction = () => {
  const succeededTransactions = useAppSelector(selectSuccessfulTransactions);

  return useLatestTransaction(succeededTransactions);
};

export default useLatestSucceededTransaction;
