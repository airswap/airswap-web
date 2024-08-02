import { useMemo } from "react";

import { TokenInfo } from "@airswap/utils";

import { useAppSelector } from "../../../../app/hooks";
import { SubmittedTransaction } from "../../../../entities/SubmittedTransaction/SubmittedTransaction";
import { selectOrderTransactions } from "../../../../features/transactions/transactionsSlice";
import { isTransactionWithOrder } from "../../../../features/transactions/transactionsUtils";
import toAtomicString from "../../../../helpers/toAtomicString";

const useBestTradeOptionTransaction = (
  nonce?: string
): SubmittedTransaction | undefined => {
  const transactions = useAppSelector(selectOrderTransactions);

  return useMemo(() => {
    return transactions.find((transaction) => {
      return (
        isTransactionWithOrder(transaction) && transaction.order.nonce === nonce
      );
    });
  }, [transactions, nonce]);
};

export default useBestTradeOptionTransaction;
