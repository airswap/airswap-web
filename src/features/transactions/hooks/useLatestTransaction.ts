import { useEffect, useState } from "react";

import { useAppSelector } from "../../../app/hooks";
import { SubmittedTransaction } from "../../../entities/SubmittedTransaction/SubmittedTransaction";

const useLatestTransaction = (storeTransactions: SubmittedTransaction[]) => {
  const { account, chainId } = useAppSelector((state) => state.web3);

  const [stateTransactions, setStateTransactions] = useState<
    SubmittedTransaction[]
  >([]);
  const [latestTransaction, setLatestTransaction] =
    useState<SubmittedTransaction>();
  const [activeAccount, setActiveAccount] = useState<string>();
  const [activeChainId, setActiveChainId] = useState<number>();

  useEffect(() => {
    if (!account || !chainId || !storeTransactions.length) {
      setStateTransactions([]);

      return;
    }

    if (activeAccount === account && activeChainId === chainId) {
      return;
    }

    if (storeTransactions[0]?.hash === stateTransactions[0]?.hash) {
      return;
    }

    setLatestTransaction(undefined);
    setActiveAccount(account);
    setActiveChainId(chainId);
    setStateTransactions(storeTransactions);
  }, [account, chainId, storeTransactions]);

  useEffect(() => {
    const stateHashes = stateTransactions.map(
      (transaction) => transaction.hash
    );
    const newTransaction = storeTransactions.find(
      (transaction) => !stateHashes.includes(transaction.hash)
    );

    if (newTransaction) {
      setLatestTransaction(newTransaction);
    }
  }, [storeTransactions]);

  return latestTransaction;
};

export default useLatestTransaction;
