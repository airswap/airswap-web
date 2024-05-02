import { OrderERC20, TokenInfo } from "@airswap/utils";
import { FullSwapERC20 } from "@airswap/utils/build/src/swap-erc20";
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
  const signerAmount = parseFloat(
    Number(
      formatUnits(transaction.order.signerAmount, signerToken.decimals)
    ).toFixed(5)
  );

  const senderAmount = parseFloat(
    Number(
      formatUnits(transaction.order.senderAmount, senderToken.decimals)
    ).toFixed(5)
  );

  return i18n.t("wallet.transaction", {
    signerAmount,
    signerToken: signerToken.symbol,
    senderAmount,
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

export const getAdjustedAmount = (
  order: OrderERC20,
  protocolFee: number,
  account: string
) => {
  if (compareAddresses(order.signerWallet, account)) {
    return new BigNumber(order.signerAmount)
      .multipliedBy(1 + protocolFee / 10000)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString();
  }

  return order.signerAmount;
};

export const getOrderTransactionLabel = (
  transaction: SubmittedOrder,
  signerToken: TokenInfo,
  senderToken: TokenInfo,
  account: string,
  protocolFee: number
) => {
  const { order, swap } = transaction;

  // TODO: Fix signerToken and senderToken sometimes reversed?
  const adjustedSignerToken = compareAddresses(
    transaction.order.signerToken,
    signerToken.address
  )
    ? signerToken
    : senderToken;
  const adjustedSenderToken = compareAddresses(
    transaction.order.senderToken,
    senderToken.address
  )
    ? senderToken
    : signerToken;

  const adjustedSignerAmount = getAdjustedAmount(order, protocolFee, account);

  const signerAmount = parseFloat(
    Number(
      formatUnits(adjustedSignerAmount, adjustedSignerToken.decimals)
    ).toFixed(5)
  );

  const senderAmount = parseFloat(
    Number(
      formatUnits((swap || order).senderAmount, adjustedSenderToken.decimals)
    ).toFixed(5)
  );

  const accountIsSender = isSenderWalletAccount(transaction, account);

  if (accountIsSender) {
    return i18n.t("wallet.transaction", {
      signerAmount,
      signerToken: adjustedSignerToken.symbol,
      senderAmount,
      senderToken: adjustedSenderToken.symbol,
    });
  }

  return i18n.t("wallet.transaction", {
    signerAmount: senderAmount,
    signerToken: adjustedSenderToken.symbol,
    senderAmount: signerAmount,
    senderToken: adjustedSignerToken.symbol,
  });
};
