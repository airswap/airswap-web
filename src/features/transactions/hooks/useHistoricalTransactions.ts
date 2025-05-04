import { useMemo, useState } from "react";

import { useAppSelector } from "../../../app/hooks";
import { findTokenByAddressAndId } from "../../../entities/AppTokenInfo/AppTokenInfoHelpers";
import { isFullOrder } from "../../../entities/FullOrder/FullOrderHelpers";
import {
  getOrderSenderTokenId,
  getOrderSignerToken,
  getOrderSignerTokenId,
  getOrderSignerWallet,
} from "../../../entities/OrderERC20/OrderERC20Helpers";
import { getOrderSenderToken } from "../../../entities/OrderERC20/OrderERC20Helpers";
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
        .filter((order) => {
          return (
            compareAddresses(getOrderSignerWallet(order.order), account) ||
            (isFullOrder(order.order) &&
              compareAddresses(order.order.sender.wallet, account)) ||
            ("swap" in order &&
              compareAddresses(order.swap.senderWallet, account))
          );
        })
        .map((log) => {
          const signerToken = getOrderSignerToken(log.order);
          const senderToken = getOrderSenderToken(log.order);
          const signerTokenId = getOrderSignerTokenId(log.order);
          const senderTokenId = getOrderSenderTokenId(log.order);
          const signerTokenInfo = findTokenByAddressAndId(
            allTokens,
            signerToken,
            signerTokenId
          );
          const senderTokenInfo = findTokenByAddressAndId(
            allTokens,
            senderToken,
            senderTokenId
          );

          if (!signerTokenInfo || !senderTokenInfo) return;

          return transformToSubmittedTransactionWithOrder(
            log.hash,
            log.order,
            signerTokenInfo,
            senderTokenInfo,
            "swap" in log ? log.swap : undefined,
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
