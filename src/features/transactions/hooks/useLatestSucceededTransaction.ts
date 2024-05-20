import { useEffect, useState } from "react";

import { useAppSelector } from "../../../app/hooks";
import { SubmittedTransaction } from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  selectPendingTransactions,
  selectSuccessfulTransactions,
} from "../transactionsSlice";

const useLatestSucceededTransaction = () => {
  const { account, chainId } = useAppSelector((state) => state.web3);

  const successfulTransactions = useAppSelector(selectSuccessfulTransactions);

  const [stateTransactions, setStateTransactions] = useState<
    SubmittedTransaction[]
  >([]);
  const [latestSuccessfulTransaction, setLatestSuccessfulTransaction] =
    useState<SubmittedTransaction>();
  const [activeAccount, setActiveAccount] = useState<string>();
  const [activeChainId, setActiveChainId] = useState<number>();

  useEffect(() => {
    if (!account || !chainId || !successfulTransactions.length) {
      setStateTransactions([]);

      return;
    }

    if (activeAccount === account && activeChainId === chainId) {
      return;
    }

    if (successfulTransactions[0]?.hash === stateTransactions[0]?.hash) {
      return;
    }

    setLatestSuccessfulTransaction(undefined);
    setActiveAccount(account);
    setActiveChainId(chainId);
    setStateTransactions(successfulTransactions);
  }, [account, chainId, successfulTransactions]);

  useEffect(() => {
    const stateHashes = stateTransactions.map(
      (transaction) => transaction.hash
    );
    const newTransaction = successfulTransactions.find(
      (transaction) => !stateHashes.includes(transaction.hash)
    );

    if (newTransaction) {
      setLatestSuccessfulTransaction(newTransaction);
    }
  }, [successfulTransactions]);

  return latestSuccessfulTransaction;
};

export default useLatestSucceededTransaction;
