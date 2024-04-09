import toast from "react-hot-toast";

import { findTokenByAddress, FullOrderERC20, TokenInfo } from "@airswap/utils";

import i18n from "i18next";

import {
  SubmittedApprovalTransaction,
  SubmittedDepositTransaction,
  SubmittedTransaction,
  SubmittedOrder,
  SubmittedWithdrawTransaction,
  SubmittedOrderUnderConsideration,
} from "../../entities/SubmittedTransaction/SubmittedTransaction";
import findEthOrTokenByAddress from "../../helpers/findEthOrTokenByAddress";
import { TransactionTypes } from "../../types/transactionTypes";
import ConfirmationToast from "./ConfirmationToast";
import CopyToast from "./CopyToast";
import ErrorToast from "./ErrorToast";
import OrderToast from "./OrderToast";
import TransactionToast from "./TransactionToast";

export const notifyTransaction = (
  type: TransactionTypes,
  transaction: SubmittedTransaction,
  tokens: TokenInfo[],
  error: boolean,
  chainId?: number
) => {
  let token: TokenInfo | null;
  // TODO: make a switch case to render a different toast for each case
  if (
    (type === TransactionTypes.order ||
      type === TransactionTypes.deposit ||
      type === TransactionTypes.withdraw) &&
    chainId
  ) {
    const tx: SubmittedOrder = transaction as SubmittedOrder;
    /*  TODO: fix toaster for multiple tabs or apps
        now that we have a listener, you can have multiple
        tabs open that receives the same order event. Only one redux
        store will have the order, and the others won't. That will
        throw an error here if we don't check for `order` inside `tx`
     */
    if (tx?.order) {
      const senderToken = findEthOrTokenByAddress(
        tx.order.senderToken,
        tokens,
        chainId
      );
      const signerToken = findEthOrTokenByAddress(
        tx.order.signerToken,
        tokens,
        chainId
      );
      toast(
        (t) => (
          <TransactionToast
            onClose={() => toast.dismiss(t.id)}
            type={type}
            transaction={transaction}
            senderToken={senderToken || undefined}
            signerToken={signerToken || undefined}
            error={error}
          />
        ),
        {
          duration: 3000,
        }
      );
    }
  } else {
    const tx: SubmittedApprovalTransaction =
      transaction as SubmittedApprovalTransaction;
    token = findTokenByAddress(tx.tokenAddress, tokens);
    toast(
      (t) => (
        <TransactionToast
          onClose={() => toast.dismiss(t.id)}
          type={type}
          transaction={transaction}
          approvalToken={token || undefined}
          error={error}
        />
      ),
      {
        duration: 3000,
      }
    );
  }
};

export const notifyApproval = (transaction: SubmittedApprovalTransaction) => {
  toast(
    (t) => (
      <TransactionToast
        onClose={() => toast.dismiss(t.id)}
        type={TransactionTypes.approval}
        transaction={transaction}
        approvalToken={transaction.token}
      />
    ),
    {
      duration: 3000,
    }
  );
};

export const notifyDeposit = (transaction: SubmittedDepositTransaction) => {
  toast(
    (t) => (
      <TransactionToast
        onClose={() => toast.dismiss(t.id)}
        type={TransactionTypes.deposit}
        transaction={transaction}
        senderToken={transaction.senderToken}
        signerToken={transaction.signerToken}
      />
    ),
    {
      duration: 3000,
    }
  );
};

export const notifyWithdrawal = (transaction: SubmittedWithdrawTransaction) => {
  toast(
    (t) => (
      <TransactionToast
        onClose={() => toast.dismiss(t.id)}
        type={TransactionTypes.withdraw}
        transaction={transaction}
        senderToken={transaction.senderToken}
        signerToken={transaction.signerToken}
      />
    ),
    {
      duration: 3000,
    }
  );
};

export const notifyOrder = (transaction: SubmittedOrder) => {
  toast(
    (t) => (
      <TransactionToast
        onClose={() => toast.dismiss(t.id)}
        type={TransactionTypes.order}
        transaction={transaction}
        senderToken={transaction.senderToken}
        signerToken={transaction.signerToken}
      />
    ),
    {
      duration: 3000,
    }
  );
};

export const notifyError = (props: { heading: string; cta: string }) => {
  toast(
    (t) => (
      <ErrorToast
        onClose={() => toast.dismiss(t.id)}
        heading={props.heading}
        cta={props.cta}
      />
    ),
    {
      duration: 3000,
    }
  );
};

export const notifyConfirmation = (props: { heading: string; cta: string }) => {
  toast(
    (t) => (
      <ConfirmationToast
        onClose={() => toast.dismiss(t.id)}
        heading={props.heading}
        cta={props.cta}
      />
    ),
    {
      duration: 3000,
    }
  );
};

export const notifyOrderCreated = (order: FullOrderERC20) => {
  toast(
    (t) => <OrderToast onClose={() => toast.dismiss(t.id)} order={order} />,
    {
      duration: 3000,
    }
  );
};

export const notifyOrderExpiry = (order: SubmittedOrderUnderConsideration) => {
  notifyError({
    heading: i18n.t("orders.swapRejected"),
    cta: i18n.t("orders.swapRejectedCallToAction"),
  });
};

export const notifyCopySuccess = () => {
  toast(
    (t) => (
      <CopyToast
        onClose={() => toast.dismiss(t.id)}
        heading={i18n.t("toast.copiedToClipboard")}
      />
    ),
    {
      duration: 1000,
    }
  );
};

export const notifyRejectedByUserError = () => {
  notifyError({
    heading: i18n.t("orders.swapFailed"),
    cta: i18n.t("orders.swapRejectedByUser"),
  });
};
