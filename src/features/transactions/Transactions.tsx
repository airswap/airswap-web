import { useEffect } from "react";

import { getEtherscanURL } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getTransactionsLocalStorageKey } from "../metadata/metadataApi";
import { revertTransaction, mineTransaction } from "./transactionActions";
import {
  selectTransactions,
  setTransactions,
  TransactionsState,
} from "./transactionsSlice";

export function Transactions() {
  const transactions = useAppSelector(selectTransactions);
  const dispatch = useAppDispatch();
  const { active, chainId, library, account } = useWeb3React<Web3Provider>();

  useEffect(() => {
    // Create a flag we can set to handle wallet changing between async operations
    let walletHasChanged = false;

    // get transaction state from local storage and update the transactions
    if (chainId && account && library) {
      const transactionsLocalStorage: TransactionsState = JSON.parse(
        localStorage.getItem(
          getTransactionsLocalStorageKey(account!, chainId!)
        )!
      ) || { all: [] };
      dispatch(setTransactions(transactionsLocalStorage));

      // check from all responses if one is pending... if pending, call getTransaction
      // to see if it was a success/failure/pending. update accordingly. if pending: wait()
      // and poll at a sensible interval.
      transactionsLocalStorage.all.forEach(async (tx) => {
        if (tx.hash) {
          if (tx.status === "processing") {
            let receipt = await library.getTransactionReceipt(tx?.hash);
            if (receipt !== null) {
              if (walletHasChanged) return;
              const status = receipt.status;
              if (status === 1) dispatch(mineTransaction(tx.hash));
              // success
              else if (status === 0)
                dispatch(
                  revertTransaction({
                    hash: tx.hash,
                    reason: "Reverted",
                  })
                ); // reverted
              return;
            } else {
              // Receipt was null, so the transaction is incomplete
              // Try to get a reference to the transaction in the mem pool - this
              // can sometimes also return null (e.g. gas price too low or tx only
              // recently sent) depending on backend.
              const transaction = await library.getTransaction(tx.hash);
              if (transaction) {
                try {
                  await transaction.wait(1);
                  if (!walletHasChanged) dispatch(mineTransaction(tx.hash)); // success
                } catch (err) {
                  console.error(err);
                  if (!walletHasChanged)
                    dispatch(
                      revertTransaction({
                        hash: tx.hash,
                        reason: "Reverted",
                      })
                    );
                }
                return;
              } else {
                // if transaction === null, we poll at intervals
                // assume failed after 30 mins
                const assumedFailureTime = Date.now() + 30 * 60 * 1000;
                while (receipt === null && Date.now() <= assumedFailureTime) {
                  // wait 30 seconds
                  await new Promise((res) => setTimeout(res, 30000));
                  receipt = await library!.getTransactionReceipt(tx.hash);
                }
                if (!receipt || receipt.status === 0) {
                  if (!walletHasChanged)
                    dispatch(
                      revertTransaction({
                        hash: tx.hash,
                        reason: "Reverted",
                      })
                    );
                } else {
                  if (!walletHasChanged) dispatch(mineTransaction(tx.hash)); // success
                }
              }
            }
          }
        }
      });
    }
    return () => {
      // Library & dispatch won't change, so when we tear down it's because
      // the wallet has changed. The useEffect will run after this and set up
      // everything for the new wallet.
      walletHasChanged = true;
    };
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
            href={`${getEtherscanURL(chainId, submittedOrder.hash!)}`}
          >
            {submittedOrder.hash}
          </a>
        </div>
      ))}
    </div>
  );
}
