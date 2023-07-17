import { useAppSelector } from "../app/hooks";
import { selectPendingDeposits } from "../features/transactions/transactionsSlice";

const useDepositPending = (): boolean => {
  const pendingDeposits = useAppSelector(selectPendingDeposits);

  return !!pendingDeposits.length;
};

export default useDepositPending;
