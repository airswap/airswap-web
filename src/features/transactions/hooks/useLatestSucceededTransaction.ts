import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../../app/hooks";
import { SubmittedTransaction } from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import { getUniqueSingleDimensionArray } from "../../../helpers/array";
import {
  selectPendingTransactions,
  selectSuccessfulTransactions,
} from "../transactionsSlice";

const useLatestSucceededTransaction = () => {
  const { chainId, account, library } = useWeb3React();

  const pendingTransactions = useAppSelector(selectPendingTransactions);
  const successfulTransactions = useAppSelector(selectSuccessfulTransactions);

  const [pendingTransactionHashes, setPendingTransactionHashes] = useState<
    string[]
  >([]);
  const [latestSuccessfulTransaction, setLatestSuccessfulTransaction] =
    useState<SubmittedTransaction>();

  useEffect(() => {
    const transaction = successfulTransactions.find((transaction) =>
      pendingTransactionHashes.includes(transaction.hash || "")
    );

    if (transaction) {
      setLatestSuccessfulTransaction(transaction);
    }
  }, [successfulTransactions]);

  useEffect(() => {
    const newPendingTransactionNonces = [
      ...pendingTransactions.map((transaction) => transaction.hash || ""),
      ...pendingTransactionHashes,
    ]
      .filter(Boolean)
      .filter(getUniqueSingleDimensionArray);

    setPendingTransactionHashes(newPendingTransactionNonces);
  }, [pendingTransactions]);

  useEffect(() => {
    if (latestSuccessfulTransaction) {
      setPendingTransactionHashes(
        pendingTransactionHashes.filter(
          (hash) => hash !== latestSuccessfulTransaction.hash
        )
      );
    }
  }, [latestSuccessfulTransaction]);

  useEffect(() => {
    setPendingTransactionHashes([]);
    setLatestSuccessfulTransaction(undefined);
  }, [chainId, account]);

  return latestSuccessfulTransaction;
};

export default useLatestSucceededTransaction;
