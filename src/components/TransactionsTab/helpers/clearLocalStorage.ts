import { Dispatch } from "redux";
import { clear, setTransactions, SubmittedTransaction } from "../../../features/transactions/transactionsSlice";

type ClearAllTransactionProps = {
  transactions: SubmittedTransaction[] | [];
  dispatch: Dispatch
}

type ClearFailedTransactionProps = {
  dispatch: Dispatch
}

export const clearAllTransactions = ({ dispatch }: ClearFailedTransactionProps) => {
  dispatch(clear())
};

export const clearFailedTransactions = ({ transactions, dispatch }: ClearAllTransactionProps) => {
  if (transactions.length > 0) {
    const filteredTransactions = transactions.filter(transaction => transaction.status !== 'declined');
    dispatch(setTransactions({ all: filteredTransactions }))
  } else {
    return;
  }
};

