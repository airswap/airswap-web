import { SubmittedTransaction } from "../../../features/transactions/transactionsSlice";


export const getFitleredFailedTransactions = (transactions: SubmittedTransaction[]) => {
  const filteredTransactions = transactions && transactions?.filter(transaction => transaction.status !== "declined");

  return filteredTransactions;
}
