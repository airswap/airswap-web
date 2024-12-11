import { useAppSelector } from "../app/hooks";
import { SubmittedDepositTransaction } from "../entities/SubmittedTransaction/SubmittedTransaction";
import { selectPendingDeposits } from "../features/transactions/transactionsSlice";

const useDepositPending = (): SubmittedDepositTransaction | undefined => {
  const pendingDeposits = useAppSelector(selectPendingDeposits);

  return pendingDeposits.length ? pendingDeposits[0] : undefined;
};

export default useDepositPending;
