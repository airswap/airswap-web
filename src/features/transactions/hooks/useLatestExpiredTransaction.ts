import { useMemo, useState } from "react";

import { useInterval } from "usehooks-ts";

import { useAppSelector } from "../../../app/hooks";
import {
  SubmittedOrderUnderConsideration,
  SubmittedTransaction,
} from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import { isSubmittedOrderUnderConsideration } from "../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { TransactionStatusType } from "../../../types/transactionTypes";
import { selectTransactions } from "../transactionsSlice";

const useLatestExpiredTransaction = ():
  | SubmittedOrderUnderConsideration
  | undefined => {
  const transactions: SubmittedTransaction[] =
    useAppSelector(selectTransactions);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useInterval(() => {
    setCurrentTime(Math.round(new Date().getTime() / 1000));
  }, 1000);

  return useMemo(() => {
    return transactions
      .filter(isSubmittedOrderUnderConsideration)
      .find((transaction) => {
        return (
          transaction.status === TransactionStatusType.processing &&
          +transaction.order.expiry < currentTime
        );
      });
  }, [transactions, currentTime]);
};

export default useLatestExpiredTransaction;
