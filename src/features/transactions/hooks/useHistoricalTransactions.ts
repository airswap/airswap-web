import { useMemo, useState } from "react";

import { useAppSelector } from "../../../app/hooks";
import { SubmittedTransaction } from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import { sortSubmittedTransactionsByExpiry } from "../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { transformToSubmittedTransactionWithOrder } from "../../../entities/SubmittedTransaction/SubmittedTransactionTransformers";
import { getUniqueArrayChildren } from "../../../helpers/array";
import { compareAddresses } from "../../../helpers/string";
import useNativeToken from "../../../hooks/useNativeToken";
import { TransactionStatusType } from "../../../types/transactionTypes";
import { selectAllTokenInfo } from "../../metadata/metadataSlice";
import { getOrdersFromDelegatedSwapLogs } from "../helpers/getOrdersFromDelegatedSwapLogs";
import { getOrdersFromErc20Logs } from "../helpers/getOrdersFromSwapErc20Logs";
import { getOrdersFromSwapLogs } from "../helpers/getOrdersFromSwapLogs";
import { getOrdersFromWrappedEventLogs } from "../helpers/getOrdersFromWrappedEventLogs";
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
  const { account, chainId } = useAppSelector((state) => state.web3);

  const tokens = useAppSelector(selectAllTokenInfo);
  const nativeToken = useNativeToken(chainId);
  const allTokens = [nativeToken, ...tokens];

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
      const fullSwapLogs = await getOrdersFromSwapLogs(
        chainId,
        swapLogs.swapLogs
      );
      const swapErc20Logs = await getOrdersFromErc20Logs(
        chainId,
        swapLogs.swapErc20Logs
      );
      const wrappedLogs = getOrdersFromWrappedEventLogs(
        swapErc20Logs,
        swapLogs.wrappedSwapLogs
      );

      const delegatedSwapLogs = getOrdersFromDelegatedSwapLogs(
        account,
        chainId,
        swapErc20Logs,
        swapLogs.delegatedSwapLogs
      );

      const submittedTransactions = [
        ...fullSwapLogs,
        ...swapErc20Logs,
        ...wrappedLogs,
        ...delegatedSwapLogs,
      ]
        .filter(
          (order) =>
            compareAddresses(order.order.signerWallet, account) ||
            compareAddresses(order.swap.senderWallet, account)
        )
        .map((log) => {
          const signerToken = allTokens.find((token) =>
            compareAddresses(token.address, log.order.signerToken)
          );
          const senderToken = allTokens.find((token) =>
            compareAddresses(token.address, log.order.senderToken)
          );

          if (!signerToken || !senderToken) return;

          return transformToSubmittedTransactionWithOrder(
            log.hash,
            log.order,
            signerToken,
            senderToken,
            log.swap,
            TransactionStatusType.succeeded,
            log.timestamp
          );
        });

      const transactions = submittedTransactions.filter(
        (order) => !!order
      ) as SubmittedTransaction[];
      const uniqueTransactions = getUniqueArrayChildren<SubmittedTransaction>(
        transactions,
        "hash"
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
