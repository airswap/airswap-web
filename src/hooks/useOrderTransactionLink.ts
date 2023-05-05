import { useMemo } from "react";

import { getReceiptUrl } from "@airswap/utils";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "../app/hooks";
import {
  selectTransactions,
  SubmittedTransaction,
} from "../features/transactions/transactionsSlice";

const useOrderTransactionLink = (nonce: string): string | undefined => {
  const { chainId } = useWeb3React<Web3Provider>();
  const transactions: SubmittedTransaction[] =
    useAppSelector(selectTransactions);

  return useMemo(() => {
    const succeededTransaction = transactions.find(
      (transaction) =>
        transaction.nonce === nonce && transaction.status === "succeeded"
    );

    if (!succeededTransaction?.hash || !chainId) {
      return undefined;
    }

    return getReceiptUrl(chainId, succeededTransaction.hash);
  }, [nonce, transactions, chainId]);
};

export default useOrderTransactionLink;
