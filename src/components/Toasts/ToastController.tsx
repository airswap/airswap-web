import toast from "react-hot-toast";

import { findTokenByAddress } from "@airswap/metadata";
import { TokenInfo } from "@uniswap/token-lists";

import {
  SubmittedApproval,
  SubmittedOrder,
} from "../../features/transactions/transactionsSlice";
import TransactionToast from "./TransactionToast";

type typeProps = "Approval" | "Order";
type transactionType = SubmittedOrder | SubmittedApproval;

export const notifyTransaction = (
  type: typeProps,
  transaction: transactionType,
  tokens: TokenInfo[],
  error: boolean
) => {
  let token: TokenInfo;
  if (type === "Order") {
    const tx: SubmittedOrder = transaction as SubmittedOrder;
    const senderToken = findTokenByAddress(tx.order.senderToken, tokens);
    const signerToken = findTokenByAddress(tx.order.signerToken, tokens);
    toast(
      (t) => (
        <TransactionToast
          onClose={() => toast.dismiss(t.id)}
          type={type}
          transaction={transaction}
          senderToken={senderToken}
          signerToken={signerToken}
          error={error}
        />
      ),
      {
        duration: 15000,
      }
    );
  } else {
    const tx: SubmittedApproval = transaction as SubmittedApproval;
    token = findTokenByAddress(tx.tokenAddress, tokens);
    toast(
      (t) => (
        <TransactionToast
          onClose={() => toast.dismiss(t.id)}
          type={type}
          transaction={transaction}
          approvalToken={token}
          error={error}
        />
      ),
      {
        duration: 15000,
      }
    );
  }
};
