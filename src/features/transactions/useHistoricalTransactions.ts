import { useCustomCompareEffect } from "@react-hookz/web/esm";
import { useWeb3React } from "@web3-react/core";

import { Event } from "ethers";

import { useAppDispatch } from "../../app/hooks";
import Weth9 from "../../constants/Weth9";
import {
  checkPendingTransactionState,
  getSwapArgsFromWrappedSwapForLog,
  SwapEventArgs,
} from "./transactionUtils";
import {
  setTransactions,
  SubmittedTransactionWithOrder,
} from "./transactionsSlice";
import useSwapLogs from "./useSwapLogs";
import useTransactionsFromLocalStorage from "./useTransactionsFromLocalStorage";

const useHistoricalTransactions = () => {
  const { chainId, library, account } = useWeb3React();
  const { result: swapLogs, status: swapLogStatus } = useSwapLogs();
  const {
    transactions: localStorageTransactions,
    setTransactions: setLocalStorageTransactions,
  } = useTransactionsFromLocalStorage();
  const dispatch = useAppDispatch();

  useCustomCompareEffect(
    () => {
      if (swapLogStatus === "loading" || swapLogStatus === "not-executed")
        return;
      if (
        !swapLogs ||
        swapLogs.chainId !== chainId ||
        swapLogs.account !== account
      )
        return;

      const localTransactionsCopy = { all: [...localStorageTransactions.all] };

      const updateStorage: () => void = async () => {
        let lastLookSwapLogs: Event[] = [],
          rfqSwapLogs: Event[] = [],
          wrappedSwapLogs: Event[] = [];

        if (!!swapLogs) {
          lastLookSwapLogs = swapLogs.lastLookSwapLogs;
          rfqSwapLogs = swapLogs.rfqSwapLogs;
          wrappedSwapLogs = swapLogs.wrappedSwapLogs;
        }

        const reconcileLogs = async (
          protocol: "last-look-erc20" | "request-for-quote-erc20",
          logs: Event[],
          isWrapped: boolean = false
        ) => {
          await Promise.all(
            logs.map(async (swapLog) => {
              const args = isWrapped
                ? await getSwapArgsFromWrappedSwapForLog(swapLog)
                : (swapLog.args as unknown as SwapEventArgs);

              const matchedTxFromStorage = localStorageTransactions.all.find(
                (tx) => {
                  if (protocol !== tx.protocol) return false;

                  const order = (tx as SubmittedTransactionWithOrder).order;
                  return (
                    order.nonce === args.nonce.toString() &&
                    order.signerWallet.toLowerCase() ===
                      args.signerWallet.toLowerCase()
                  );
                }
              );
              if (matchedTxFromStorage) {
                // We already knew this one had succeeded.
                if (matchedTxFromStorage.status === "succeeded") return;
                else {
                  matchedTxFromStorage.status = "succeeded";
                  return;
                }
              } else {
                // Wrapped swaps will show WETH, but the user actually sent ETH.
                const senderToken = !isWrapped
                  ? args.senderToken
                  : args.senderToken.toLowerCase() === Weth9[chainId!]
                  ? "0x0000000000000000000000000000000000000000"
                  : args.senderToken;
                const signerToken = !isWrapped
                  ? args.signerToken
                  : args.signerToken.toLowerCase() === Weth9[chainId!]
                  ? "0x0000000000000000000000000000000000000000"
                  : args.signerToken;
                // We don't have a record of this transaction, so we need to create it.
                // const newTransaction:
                const blockTimestamp = (await swapLog.getBlock()).timestamp;
                const newTx: SubmittedTransactionWithOrder = {
                  protocol,
                  status: "succeeded",
                  timestamp: blockTimestamp * 1000,
                  type: "Order",
                  hash: swapLog.transactionHash,
                  nonce: args.nonce.toString(),
                  order: {
                    expiry: "-",
                    nonce: args.nonce.toString(),
                    signerWallet: args.signerWallet,
                    signerToken,
                    senderToken,
                    senderAmount: args.senderAmount.toString(),
                    signerAmount: args.signerAmount.toString(),
                    v: "-",
                    r: "-",
                    s: "-",
                  },
                };
                localTransactionsCopy.all.push(newTx);
              }
            })
          );
        };

        await Promise.all([
          reconcileLogs("last-look-erc20", lastLookSwapLogs),
          reconcileLogs("request-for-quote-erc20", rfqSwapLogs),
          reconcileLogs("request-for-quote-erc20", wrappedSwapLogs, true),
        ]);

        setLocalStorageTransactions(localTransactionsCopy);
        dispatch(setTransactions(localTransactionsCopy));

        localTransactionsCopy.all
          .filter((tx) => tx.status === "processing")
          .forEach((tx) => {
            checkPendingTransactionState(tx, dispatch, library);
          });
      };

      updateStorage();
    },
    [
      account,
      chainId,
      swapLogs,
      swapLogStatus,
      localStorageTransactions,
      setLocalStorageTransactions,
      dispatch,
      library,
    ],
    (
      [account, chainId, swapLogs, swapLogStatus],
      [accountNew, chainIdNew, swapLogsNew, swapLogStatusNew]
    ) => {
      // This is a change comparator so that we don't run this effect too
      // frequently. Without this, we'd get an infinite loop because the
      // effect modifies the transactions stored in localStorage.
      return (
        swapLogStatus === swapLogStatusNew &&
        swapLogs === swapLogsNew &&
        chainId === chainIdNew &&
        account === accountNew
      );
    }
  );
};

export default useHistoricalTransactions;
