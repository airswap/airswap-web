import { useMemo, useState } from "react";

import { useInterval } from "usehooks-ts";

import { useAppSelector } from "../../../app/hooks";
import {
  ASSUMED_EXPIRY_NOTIFICATION_BUFFER_SEC,
  LAST_LOOK_ORDER_EXPIRY_SEC,
} from "../../../constants/configParams";
import {
  SubmittedOrder,
  SubmittedOrderUnderConsideration,
  SubmittedTransaction,
} from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  isSubmittedOrder,
  isSubmittedOrderUnderConsideration,
} from "../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { TransactionStatusType } from "../../../types/transactionTypes";
import { selectTransactions } from "../transactionsSlice";

const useLatestExpiredTransaction = ():
  | SubmittedOrder
  | SubmittedOrderUnderConsideration
  | undefined => {
  const transactions: SubmittedTransaction[] =
    useAppSelector(selectTransactions);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useInterval(() => {
    setCurrentTime(Math.round(new Date().getTime() / 1000));
  }, 1000);

  const lastExpiredOrderUnderConsideration = useMemo(() => {
    return transactions
      .filter(isSubmittedOrderUnderConsideration)
      .find((transaction) => {
        return (
          transaction.status === TransactionStatusType.processing &&
          +transaction.order.expiry + LAST_LOOK_ORDER_EXPIRY_SEC < currentTime
        );
      });
  }, [transactions, currentTime]);

  const lastExpiredOrderWithOrder = useMemo(() => {
    return transactions.filter(isSubmittedOrder).find((transaction) => {
      return (
        transaction.status === TransactionStatusType.processing &&
        +transaction.order.expiry + ASSUMED_EXPIRY_NOTIFICATION_BUFFER_SEC <
          currentTime
      );
    });
  }, [transactions, currentTime]);

  return lastExpiredOrderUnderConsideration || lastExpiredOrderWithOrder;
};

export default useLatestExpiredTransaction;
