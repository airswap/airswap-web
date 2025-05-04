import {
  ADDRESS_ZERO,
  FullOrder,
  FullSwapERC20,
  OrderERC20,
  TokenInfo,
  TokenKinds,
  UnsignedOrderERC20,
} from "@airswap/utils";
import { formatUnits } from "@ethersproject/units";

import { BigNumber } from "bignumber.js";

import { compareAddresses } from "../../helpers/string";
import i18n from "../../i18n/i18n";
import { TransactionTypes } from "../../types/transactionTypes";
import { AppTokenInfo } from "../AppTokenInfo/AppTokenInfo";
import {
  getTokenDecimals,
  getTokenSymbol,
} from "../AppTokenInfo/AppTokenInfoHelpers";
import { isFullOrder } from "../FullOrder/FullOrderHelpers";
import {
  SubmittedApprovalTransaction,
  SubmittedCancellation,
  SubmittedDepositTransaction,
  SubmittedLastLookOrder,
  SubmittedTransaction,
  SubmittedOrder,
  SubmittedWithdrawTransaction,
  SubmittedOrderUnderConsideration,
  SubmittedSetRuleTransaction,
  SubmittedDelegatedSwapTransaction,
  SubmittedUnsetRuleTransaction,
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

export const isSetRuleTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedSetRuleTransaction =>
  transaction.type === TransactionTypes.setDelegateRule;

export const isUnsetRuleTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedUnsetRuleTransaction =>
  transaction.type === TransactionTypes.unsetRule;

export const isDelegatedSwapTransaction = (
  transaction: SubmittedTransaction
): transaction is SubmittedDelegatedSwapTransaction =>
  transaction.type === TransactionTypes.delegatedSwap;

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
    const signerWallet = isFullOrder(transaction.order)
      ? transaction.order.signer.wallet
      : transaction.order.signerWallet;

    return `${signerWallet}-${transaction.order.nonce}-${transaction.timestamp}`;
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
  // If senderToken is ADDRESS_ZERO, then that means a swapWithWrap transaction has been done.
  // So the account must be the senderWallet.
  if (
    isSubmittedOrder(transaction) &&
    !isFullOrder(transaction.order) &&
    transaction.order.senderToken === ADDRESS_ZERO
  ) {
    return true;
  }

  if (isSubmittedOrder(transaction)) {
    const signerWallet = isFullOrder(transaction.order)
      ? transaction.order.signer.wallet
      : transaction.order.signerWallet;

    return !compareAddresses(signerWallet, account);
  }

  return false;
};

const getAmountPlusProtocolFee = (amount: string, protocolFee: number) => {
  return new BigNumber(amount)
    .multipliedBy(1 + protocolFee / 10000)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString();
};

const getAdjustedSignerAmount = (
  order: OrderERC20 | UnsignedOrderERC20 | FullOrder,
  protocolFee: number,
  account: string
) => {
  // FullOrder signer does not pay protocol fees
  if (isFullOrder(order)) {
    return order.signer.kind === TokenKinds.ERC721 ? "1" : order.signer.amount;
  }

  // OrderERC20 signer pays protocol fees
  if (compareAddresses(order.signerWallet, account)) {
    return getAmountPlusProtocolFee(order.signerAmount, protocolFee);
  }

  return order.signerAmount;
};

const getAdjustedSenderAmount = (
  order: OrderERC20 | UnsignedOrderERC20 | FullOrder,
  swap: FullSwapERC20 | undefined,
  protocolFee: number,
  account: string
) => {
  // FullOrder sender pays protocol fees
  if (isFullOrder(order) && compareAddresses(order.sender.wallet, account)) {
    return getAmountPlusProtocolFee(order.sender.amount, protocolFee);
  }

  return isFullOrder(order)
    ? order.sender.amount
    : (swap || order).senderAmount;
};

export const getOrderTransactionLabel = (
  transaction: SubmittedOrder | SubmittedDelegatedSwapTransaction,
  signerToken: AppTokenInfo,
  senderToken: AppTokenInfo,
  account: string,
  protocolFee: number
) => {
  const { order } = transaction;
  const swap = isSubmittedOrder(transaction) ? transaction.swap : undefined;

  const adjustedSignerAmount = getAdjustedSignerAmount(
    order,
    protocolFee,
    account
  );
  const adjustedSenderAmount = getAdjustedSenderAmount(
    order,
    swap,
    protocolFee,
    account
  );

  const signerDecimals = getTokenDecimals(signerToken);
  const signerAmount = parseFloat(
    Number(formatUnits(adjustedSignerAmount, signerDecimals)).toFixed(5)
  );

  const senderDecimals = getTokenDecimals(senderToken);
  const senderAmount = parseFloat(
    Number(formatUnits(adjustedSenderAmount, senderDecimals)).toFixed(5)
  );

  const accountIsSender = isSenderWalletAccount(transaction, account);

  if (accountIsSender) {
    return i18n.t("wallet.transaction", {
      signerAmount,
      signerToken: getTokenSymbol(signerToken),
      senderAmount,
      senderToken: getTokenSymbol(senderToken),
    });
  }

  return i18n.t("wallet.transaction", {
    signerAmount: senderAmount,
    signerToken: getTokenSymbol(senderToken),
    senderAmount: signerAmount,
    senderToken: getTokenSymbol(signerToken),
  });
};

export const getSetRuleTransactionLabel = (
  transaction: SubmittedSetRuleTransaction
) => {
  const { signerToken, senderToken } = transaction;
  const signerAmount = parseFloat(
    Number(
      formatUnits(transaction.rule.signerAmount, signerToken.decimals)
    ).toFixed(5)
  );

  const senderAmount = parseFloat(
    Number(
      formatUnits(transaction.rule.senderAmount, senderToken.decimals)
    ).toFixed(5)
  );

  const transactionLabel = i18n.t("wallet.transaction", {
    signerAmount,
    signerToken: signerToken.symbol,
    senderAmount,
    senderToken: senderToken.symbol,
  });

  return `${i18n.t("wallet.setRule")}: ${transactionLabel}`;
};

export const getUnsetRuleTransactionLabel = (
  transaction: SubmittedUnsetRuleTransaction
) => {
  const { senderToken, signerToken } = transaction;

  return `${i18n.t("wallet.unsetRule")}: ${senderToken.symbol} → ${
    signerToken.symbol
  }`;
};
