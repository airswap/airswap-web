import { TokenInfo } from "@airswap/utils";

import { AppTokenInfo } from "../../../entities/AppTokenInfo/AppTokenInfo";
import {
  SubmittedDelegatedSwapTransaction,
  SubmittedDepositTransaction,
  SubmittedOrder,
  SubmittedWithdrawTransaction,
} from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  getDepositOrWithdrawalTransactionLabel,
  getOrderTransactionLabel,
  isDepositTransaction,
  isWithdrawTransaction,
} from "../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";

const getWalletTransactionOrderText = (
  transaction:
    | SubmittedOrder
    | SubmittedWithdrawTransaction
    | SubmittedDepositTransaction
    | SubmittedDelegatedSwapTransaction,
  signerToken: AppTokenInfo,
  senderToken: AppTokenInfo,
  account: string,
  protocolFee: number
): string => {
  if (isWithdrawTransaction(transaction) || isDepositTransaction(transaction)) {
    return getDepositOrWithdrawalTransactionLabel(
      transaction,
      signerToken as TokenInfo,
      senderToken as TokenInfo
    );
  }

  return getOrderTransactionLabel(
    transaction,
    signerToken,
    senderToken,
    account,
    protocolFee
  );
};

export default getWalletTransactionOrderText;
