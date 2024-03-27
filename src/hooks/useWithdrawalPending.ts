import { useAppSelector } from "../app/hooks";
import { selectPendingWithdrawals } from "../features/transactions/transactionsSlice";

const useWithdrawalPending = (): boolean => {
  const pendingWithdrawals = useAppSelector(selectPendingWithdrawals);

  return !!pendingWithdrawals.length;
};

export default useWithdrawalPending;
