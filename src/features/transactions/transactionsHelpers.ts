import { AppDispatch, RootState } from "../../app/store";
import { SubmittedTransaction } from "../../entities/SubmittedTransaction/SubmittedTransaction";
import { setTransactions } from "./transactionsSlice";

export const updateTransaction =
  (updatedTransaction: SubmittedTransaction) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const transactions = getState().transactions.transactions;
    const transactionIndex = transactions.findIndex(
      (transaction) => transaction.hash === updatedTransaction.hash
    );

    if (transactionIndex === -1) {
      return;
    }

    const updatedTransactions = [...transactions];
    updatedTransactions.splice(transactionIndex, 1, updatedTransaction);

    console.log(updatedTransactions);

    dispatch(setTransactions(updatedTransactions));
  };
