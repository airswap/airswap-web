import { useEffect } from "react";
import { getEtherscanURL } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectTransactions,
  setTransaction,
  TransactionsState,
} from "./transactionsSlice";
import { revertTransaction, mineTransaction } from "./transactionActions";
import { getTransactionsLocalStorageKey } from "../metadata/metadataApi";

export function Transactions() {
  const transactions = useAppSelector(selectTransactions);
  const dispatch = useAppDispatch();
  const { active, chainId, library, account } = useWeb3React<Web3Provider>();

  useEffect(() => {

    const updateTransaction = (txs: TransactionsState) => {
      dispatch(setTransaction(txs));
    }

    // get transaction state from local storage and update the transactions
    if (chainId && account) {
      const transactionsLocalStorage: TransactionsState = JSON.parse(
        localStorage.getItem(
          getTransactionsLocalStorageKey(chainId!, account!)
        )!
      ) || {all: []};

      updateTransaction(transactionsLocalStorage);

      // check from all responses if one is pending... if pending, call getTransaction
      // to see if it was a success/failure/pending. update accordingly. if pending: wait()
      // and poll at a sensible interval.
      transactionsLocalStorage.all.forEach(async (tx) => {
        if (tx.status === "processing") {
          let receipt = await library?.getTransactionReceipt(tx.hash);
          if (receipt !== null) {
            const status = receipt!.status;
            if (status === 1) dispatch(mineTransaction(tx.hash)); // success
            else if (status === 0)
              dispatch(
                revertTransaction({
                  hash: tx.hash,
                  reason: "User has cancelled transaction.",
                })
              ); // reverted
            return;
          } else {
            const transaction = await library?.getTransaction(tx.hash);
            if (transaction) {
              try {
                await transaction.wait(1);
                dispatch(mineTransaction(tx.hash)); // success
              } catch (err) {
                console.error(err);
                dispatch(
                  revertTransaction({
                    hash: tx.hash,
                    reason: "User has cancelled transaction.",
                  })
                );
              }
              return;
            } else { // if transaction === null, we poll at intervals
              // assume failed after 30 mins
              const assumedFailureTime = Date.now() + 30 * 60 * 1000;
              while (receipt === null && Date.now() <= assumedFailureTime) {
                  // wait 30 seconds
                  await new Promise((res)=> setTimeout(res, 30000));
                  receipt = await library!.getTransactionReceipt(tx.hash);
                  // TODO: exit loop if wallet or chainId changes
              }
              if (!receipt || receipt.status === 0) {
                dispatch(
                  revertTransaction({
                    hash: tx.hash,
                    reason: "User has cancelled transaction.",
                  })
                );
              } else {
                dispatch(mineTransaction(tx.hash)); // success
              }
            }
          }
        } 
      });
    }

  }, [chainId, dispatch, library, account]);

  if (!active || !chainId) return null;

  const icons = {
    succeeded: "✅",
    reverted: "🚫",
    processing: "⏳",
  };

  return (
    <div>
      {transactions.map((submittedOrder) => (
        <div key={submittedOrder.hash}>
          {icons[submittedOrder.status]}:
          <a
            target="_blank"
            rel="noreferrer"
            href={`${getEtherscanURL(`${chainId}`, submittedOrder.hash!)}`}
          >
            {submittedOrder.hash}
          </a>
        </div>
      ))}
    </div>
  );
}
