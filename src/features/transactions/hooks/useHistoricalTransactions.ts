import { useMemo, useState } from "react";

import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../../../app/hooks";
import { SubmittedTransaction } from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import { sortSubmittedTransactionsByExpiry } from "../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { transformToSubmittedTransactionWithOrder } from "../../../entities/SubmittedTransaction/SubmittedTransactionTransformers";
import { getUniqueArrayChildren } from "../../../helpers/array";
import { getOrdersFromLogs } from "../../../helpers/getOrdersFromLogs";
import { compareAddresses } from "../../../helpers/string";
import { TransactionStatusType } from "../../../types/transactionTypes";
import { selectAllTokenInfo } from "../../metadata/metadataSlice";
import useSwapLogs from "./useSwapLogs";

interface HistoricalTransactionsCollection {
  chainId: number;
  account: string;
  transactions: SubmittedTransaction[];
}

// Historical transactions are gathered from contract event logs when a user connects his wallet. This way we can
// still get transaction history even after the user clears his cache. Or if he somehow missed a transaction it will be
// merged into the transaction history.

const useHistoricalTransactions = (): [
  HistoricalTransactionsCollection | undefined,
  boolean
] => {
  const { chainId, account, library } = useWeb3React();

  const tokens = useAppSelector(selectAllTokenInfo);
  const { result: swapLogs, status: swapLogStatus } = useSwapLogs(
    chainId,
    account
  );

  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] =
    useState<HistoricalTransactionsCollection>();

  useMemo(() => {
    if (
      !chainId ||
      !swapLogs ||
      swapLogStatus === "loading" ||
      swapLogStatus === "not-executed" ||
      swapLogs.chainId !== chainId ||
      swapLogs.account !== account
    ) {
      return;
    }

    setIsLoading(true);
    setTransactions(undefined);

    const getTransactionsFromLogs = async () => {
      const rfqOrders = await getOrdersFromLogs(chainId, swapLogs.swapLogs);
      // TODO: Add support for lastLook orders https://github.com/airswap/airswap-web/issues/891
      // const lastLookOrders = await getOrdersFromLogs(swapLogs.swapLogs);

      const rfqSubmittedTransactions = rfqOrders
        .filter(
          (order) =>
            compareAddresses(order.params.signerWallet, account) ||
            compareAddresses(order.senderWallet, account)
        )
        .map((order) => {
          const signerToken = tokens.find(
            (token) => token.address === order.params.signerToken
          );
          const senderToken = tokens.find(
            (token) => token.address === order.params.senderToken
          );

          if (!signerToken || !senderToken) return;

          return transformToSubmittedTransactionWithOrder(
            order.hash,
            order.params,
            signerToken,
            senderToken,
            TransactionStatusType.succeeded,
            order.timestamp
          );
        });

      const transactions = rfqSubmittedTransactions.filter(
        (order) => !!order
      ) as SubmittedTransaction[];
      const uniqueTransactions = getUniqueArrayChildren<SubmittedTransaction>(
        transactions,
        "nonce"
      );

      const sortedTransactions = uniqueTransactions.sort(
        sortSubmittedTransactionsByExpiry
      );

      setIsLoading(false);
      setTransactions({
        chainId,
        account,
        transactions: sortedTransactions,
      });
    };

    getTransactionsFromLogs();
  }, [swapLogs, swapLogStatus]);

  return [transactions, isLoading];
};

export default useHistoricalTransactions;
