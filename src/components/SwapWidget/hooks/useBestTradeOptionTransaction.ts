import { useMemo } from "react";

import { TokenInfo } from "@airswap/types";
import { toAtomicString } from "@airswap/utils";

import { useAppSelector } from "../../../app/hooks";
import { isTransactionWithOrder } from "../../../features/transactions/transactionUtils";
import {
  selectOrderTransactions,
  SubmittedTransaction,
} from "../../../features/transactions/transactionsSlice";

const useBestTradeOptionTransaction = (
  tokenInfo: TokenInfo | null,
  nonce?: string,
  quoteAmount?: string
): SubmittedTransaction | undefined => {
  const transactions = useAppSelector(selectOrderTransactions);

  return useMemo(() => {
    if (!quoteAmount || !tokenInfo) {
      return undefined;
    }

    return transactions.find((transaction) => {
      if (!isTransactionWithOrder(transaction)) {
        return false;
      }

      const senderAmount = toAtomicString(quoteAmount, tokenInfo.decimals);

      return (
        transaction.order.nonce === nonce ||
        transaction.order.senderAmount === senderAmount
      );
    });
  }, [transactions, nonce, quoteAmount]);
};

export default useBestTradeOptionTransaction;
