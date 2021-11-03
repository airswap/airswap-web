import { useEffect } from "react";

import { getEtherscanURL } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getTransactionsLocalStorageKey } from "../metadata/metadataApi";
import handleTransaction from "./handleTransaction";
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

      transactionsLocalStorage.all.forEach(async (tx) => {
        handleTransaction(tx, walletHasChanged, dispatch, library);
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
