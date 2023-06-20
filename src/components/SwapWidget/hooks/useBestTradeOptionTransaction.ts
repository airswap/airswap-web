import { useMemo } from "react";
import { useAppSelector } from "../../../app/hooks"
import { selectBestOption } from "../../../features/orders/ordersSlice";
import { selectOrderTransactions, SubmittedTransaction } from "../../../features/transactions/transactionsSlice"

type UseBestTradeOptionTransactionProps = {
  nonce: string | undefined
}

interface Order {
  senderAmount: string;
  signerAmount: string;
}

interface ExtendedSubmittedTransaction extends SubmittedTransaction {
  order?: Order
}

const useBestTradeOptionTransaction = ({ nonce }: UseBestTradeOptionTransactionProps): SubmittedTransaction | undefined => {
  const transactions = useAppSelector(selectOrderTransactions);
  const bestTradeOption = useAppSelector(selectBestOption);

  return useMemo(() => {
    if (bestTradeOption?.protocol === 'request-for-quote-erc20') {
      return transactions.find((transaction) => transaction.nonce === bestTradeOption?.order?.nonce);
    } else {
      return transactions.find((transaction: ExtendedSubmittedTransaction) => transaction.order?.senderAmount === bestTradeOption?.pricing?.quoteAmount)
    }
  }, [transactions, nonce]);
}

export default useBestTradeOptionTransaction
