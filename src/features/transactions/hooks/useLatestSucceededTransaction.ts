import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../../app/hooks";
import { SubmittedTransaction } from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import { isSubmittedOrder } from "../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { getUniqueSingleDimensionArray } from "../../../helpers/array";
import {
  selectPendingTransactions,
  selectSuccessfulTransactions,
} from "../transactionsSlice";

const getTransactionId = (transaction: SubmittedTransaction) => {
  return isSubmittedOrder(transaction)
    ? transaction.order.nonce
    : transaction.hash || "";
};

const useLatestSucceededTransaction = () => {
  const { chainId, account, library } = useWeb3React();

  const pendingTransactions = useAppSelector(selectPendingTransactions);
  const successfulTransactions = useAppSelector(selectSuccessfulTransactions);

  const [pendingTransactionIds, setPendingTransactionIds] = useState<string[]>(
    []
  );
  const [latestSuccessfulTransaction, setLatestSuccessfulTransaction] =
    useState<SubmittedTransaction>();

  useEffect(() => {
    const transaction = successfulTransactions.find((transaction) => {
      return pendingTransactionIds.includes(getTransactionId(transaction));
    });

    if (transaction) {
      setLatestSuccessfulTransaction(transaction);
    }
  }, [successfulTransactions]);

  useEffect(() => {
    const newPendingTransactionNonces = [
      ...pendingTransactions.map((transaction) =>
        getTransactionId(transaction)
      ),
      ...pendingTransactionIds,
    ]
      .filter(Boolean)
      .filter(getUniqueSingleDimensionArray);

    setPendingTransactionIds(newPendingTransactionNonces);
  }, [pendingTransactions]);

  useEffect(() => {
    if (latestSuccessfulTransaction) {
      setPendingTransactionIds(
        pendingTransactionIds.filter(
          (id) => id !== getTransactionId(latestSuccessfulTransaction)
        )
      );
    }
  }, [latestSuccessfulTransaction]);

  useEffect(() => {
    setPendingTransactionIds([]);
    setLatestSuccessfulTransaction(undefined);
  }, [chainId, account]);

  return latestSuccessfulTransaction;
};

export default useLatestSucceededTransaction;
