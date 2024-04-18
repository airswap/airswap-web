import { TokenInfo } from "@airswap/utils";
import { formatUnits } from "@ethersproject/units";

import { BigNumber } from "bignumber.js";

import {
  SubmittedDepositTransaction,
  SubmittedOrder,
  SubmittedTransaction,
  SubmittedWithdrawTransaction,
} from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  getDepositOrWithdrawalTransactionLabel,
  getOrderTransactionLabel,
  isDepositTransaction,
  isLastLookOrderTransaction,
  isSubmittedOrder,
  isWithdrawTransaction,
} from "../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { compareAddresses } from "../../../helpers/string";
import i18n from "../../../i18n/i18n";

const getWalletTransactionOrderText = (
  transaction:
    | SubmittedOrder
    | SubmittedWithdrawTransaction
    | SubmittedDepositTransaction,
  signerToken: TokenInfo,
  senderToken: TokenInfo,
  account: string,
  protocolFee: number
): string => {
  if (isWithdrawTransaction(transaction) || isDepositTransaction(transaction)) {
    return getDepositOrWithdrawalTransactionLabel(
      transaction,
      signerToken,
      senderToken
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
