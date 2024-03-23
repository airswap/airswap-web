import { TransactionReceipt } from "@ethersproject/providers";

import { AppDispatch } from "../../app/store";
import {
  notifyApproval,
  notifyDeposit,
  notifyError,
  notifyOrder,
  notifyWithdrawal,
} from "../../components/Toasts/ToastController";
import {
  SubmittedApprovalTransaction,
  SubmittedDepositTransaction,
  SubmittedTransactionWithOrder,
  SubmittedWithdrawTransaction,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import toRoundedAtomicString from "../../helpers/toRoundedAtomicString";
import i18n from "../../i18n/i18n";
import {
  allowancesSwapActions,
  decrementBalanceBy,
  incrementBalanceBy,
} from "../balances/balancesSlice";
import {
  mineTransaction,
  revertTransaction,
} from "../transactions/transactionActions";

const failTransaction = (
  hash: string,
  heading: string,
  dispatch: AppDispatch
): void => {
  dispatch(revertTransaction({ hash }));

  notifyError({
    heading,
    cta: i18n.t("validatorErrors.unknownError"),
  });
};

export const handleApproveTransaction = (
  transaction: SubmittedApprovalTransaction,
  receipt: TransactionReceipt,
  dispatch: AppDispatch
): void => {
  if (receipt.status !== 1) {
    failTransaction(
      receipt.transactionHash,
      i18n.t("toast.approvalFail"),
      dispatch
    );

    return;
  }

  const amount = toRoundedAtomicString(
    transaction.amount,
    transaction.token.decimals
  );

  dispatch(mineTransaction({ hash: transaction.hash }));
  dispatch(
    allowancesSwapActions.set({
      tokenAddress: transaction.tokenAddress,
      amount: amount,
    })
  );

  notifyApproval(transaction);
};

export const handleSubmittedDepositOrder = (
  transaction: SubmittedDepositTransaction,
  receipt: TransactionReceipt,
  dispatch: AppDispatch
): void => {
  if (receipt.status !== 1) {
    failTransaction(
      receipt.transactionHash,
      i18n.t("toast.swapFail"),
      dispatch
    );

    return;
  }

  const amount = toRoundedAtomicString(
    transaction.order.senderAmount,
    transaction.order.senderToken.decimals
  );

  dispatch(mineTransaction({ hash: transaction.hash }));
  dispatch(
    incrementBalanceBy({
      tokenAddress: transaction.order.senderToken.address,
      amount: amount,
    })
  );

  notifyDeposit(transaction);
};

export const handleSubmittedWithdrawOrder = (
  transaction: SubmittedWithdrawTransaction,
  receipt: TransactionReceipt,
  dispatch: AppDispatch
): void => {
  if (receipt.status !== 1) {
    failTransaction(
      receipt.transactionHash,
      i18n.t("toast.swapFail"),
      dispatch
    );

    return;
  }

  const amount = toRoundedAtomicString(
    transaction.order.senderAmount,
    transaction.order.senderToken.decimals
  );

  dispatch(mineTransaction({ hash: transaction.hash }));
  dispatch(
    decrementBalanceBy({
      tokenAddress: transaction.order.senderToken.address,
      amount: amount,
    })
  );

  notifyWithdrawal(transaction);
};

export const handleSubmittedRFQOrder = (
  transaction: SubmittedTransactionWithOrder,
  receipt: TransactionReceipt,
  dispatch: AppDispatch
): void => {
  if (receipt.status !== 1) {
    failTransaction(
      receipt.transactionHash,
      i18n.t("toast.swapFail"),
      dispatch
    );

    return;
  }

  notifyOrder(transaction);
};
