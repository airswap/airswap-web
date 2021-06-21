import { useEffect } from "react";
import { getEtherscanURL } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectTransactions, setTransaction } from "./transactionsSlice";
import {
  revertTransaction,
  mineTransaction,
} from "./transactionActions";
import { getTransactionsLocalStorageKey } from "../metadata/metadataApi";

export function Transactions() {
  const transactions = useAppSelector(selectTransactions);
  const dispatch = useAppDispatch();
  const { active, chainId, library } = useWeb3React<Web3Provider>();

  useEffect(() => {
    // get transaction state from local storage and update the transactions
    if (chainId) {
      const transactionsLocalStorage = JSON.parse(localStorage.getItem(getTransactionsLocalStorageKey(chainId!))!);
  
      dispatch(setTransaction(transactionsLocalStorage))
  
      // check from all responses if one is pending... if pending, call getTransaction 
      // to see if it was a success/failure/pending. update accordingly. if pending: wait() 
      // and poll at a sensible interval.
      // TODO: Poll at sensible intervals
      transactions.forEach(tx => {
        if (tx.status === "processing") {
          library!.getTransactionReceipt(tx.hash).then(receipt => {
            if (receipt === null) {
              dispatch(revertTransaction({hash: tx.hash, reason: "User has cancelled transaction."}));
            }
            else {
              const status = receipt.status;
              if (status === 1) dispatch(mineTransaction(tx.hash)); // success
              else if (status === 0) dispatch(revertTransaction({hash: tx.hash, reason: "User has cancelled transaction."})); // cancelled
            }
          })
        }
      });
    }
  }, [chainId, dispatch, library]);

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
