import { TokenInfo } from "@airswap/utils";
import { formatUnits } from "@ethersproject/units";

import { BigNumber } from "bignumber.js";

import { compareAddresses } from "../../helpers/string";
import i18n from "../../i18n/i18n";
import { TransactionTypes } from "../../types/transactionTypes";
import {
  SubmittedApprovalTransaction,
  SubmittedCancellation,
  SubmittedDepositTransaction,
  SubmittedLastLookOrder,
  SubmittedTransaction,
  SubmittedOrder,
  SubmittedWithdrawTransaction,
  SubmittedOrderUnderConsideration,
} from "./SubmittedTransaction";

export const isApprovalTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedApprovalTransaction =>
  transaction.type === TransactionTypes.approval;

export const isCancelTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedCancellation =>
  transaction.type === TransactionTypes.cancel;

export const isDepositTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedDepositTransaction =>
  transaction.type === TransactionTypes.deposit;

export const isWithdrawTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedWithdrawTransaction =>
  transaction.type === TransactionTypes.withdraw;

export const isSubmittedOrder = (
  transaction: SubmittedTransaction
): transaction is SubmittedOrder => {
  return transaction.type === TransactionTypes.order;
};

export const isSubmittedOrderUnderConsideration = (
  transaction: SubmittedTransaction
): transaction is SubmittedOrderUnderConsideration => {
  return transaction.type === TransactionTypes.order && !transaction.hash;
};

export const isLastLookOrderTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedLastLookOrder => {
  return (
    isSubmittedOrder(transaction) &&
    !!transaction.hash &&
    !!transaction.isLastLook
  );
};

export const sortSubmittedTransactionsByExpiry = (
  a: SubmittedTransaction,
  b: SubmittedTransaction
) => {
  return b.timestamp - a.timestamp;
};

export const getSubmittedTransactionKey = (
  transaction: SubmittedTransaction
) => {
  if (isSubmittedOrderUnderConsideration(transaction)) {
    return `${transaction.order.signerWallet}-${transaction.order.nonce}-${transaction.timestamp}`;
  }

  return transaction.hash;
};

export const doTransactionsMatch = (
  transaction: SubmittedTransaction,
  match: SubmittedTransaction,
  hash?: string
): boolean => {
  if (
    isSubmittedOrderUnderConsideration(transaction) &&
    isSubmittedOrderUnderConsideration(match)
  ) {
    return transaction.order.nonce === match.order.nonce;
  }

  return transaction.hash === match.hash || transaction.hash === hash;
};

export const getDepositOrWithdrawalTransactionLabel = (
  transaction: SubmittedDepositTransaction | SubmittedWithdrawTransaction,
  signerToken: TokenInfo,
  senderToken: TokenInfo
): string => {
  return i18n.t("wallet.transaction", {
    signerAmount: transaction.order.signerAmount,
    signerToken: signerToken.symbol,
    senderAmount: transaction.order.signerAmount,
    senderToken: senderToken.symbol,
  });
};

const isSenderWalletAccount = (
  transaction: SubmittedTransaction,
  account: string
) => {
  if (isSubmittedOrder(transaction) && transaction.swap) {
    return compareAddresses(transaction.swap.senderWallet, account);
  }

  return false;
};

export const getOrderTransactionLabel = (
  transaction: SubmittedOrder,
  signerToken: TokenInfo,
  senderToken: TokenInfo,
  account: string,
  protocolFee: number
) => {
  const { order, swap } = transaction;

  const signerAmountWithFee =
    !swap && transaction.isLastLook
      ? new BigNumber(transaction.order.signerAmount)
          .multipliedBy(1 + protocolFee / 10000)
          .integerValue(BigNumber.ROUND_FLOOR)
          .toString()
      : undefined;

  const translation =
    isSubmittedOrder(transaction) && transaction.isLastLook
      ? "wallet.lastLookTransaction"
      : "wallet.transaction";

  const signerAmount = parseFloat(
    Number(
      formatUnits(
        signerAmountWithFee || (swap || order).signerAmount,
        signerToken.decimals
      )
    ).toFixed(5)
  );

  const senderAmount = parseFloat(
    Number(
      formatUnits((swap || order).senderAmount, senderToken.decimals)
    ).toFixed(5)
  );

  const accountIsSender = isSenderWalletAccount(transaction, account);

  if (accountIsSender) {
    return i18n.t(translation, {
      signerAmount,
      signerToken: signerToken.symbol,
      senderAmount,
      senderToken: senderToken.symbol,
    });
  }

  return i18n.t(translation, {
    signerAmount: senderAmount,
    signerToken: senderToken.symbol,
    senderAmount: signerAmount,
    senderToken: signerToken.symbol,
  });
};
