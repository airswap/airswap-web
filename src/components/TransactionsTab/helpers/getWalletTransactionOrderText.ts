import { TokenInfo } from "@airswap/utils";
import { formatUnits } from "@ethersproject/units";

import { BigNumber } from "bignumber.js";

import { SubmittedTransaction } from "../../../entities/SubmittedTransaction/SubmittedTransaction";
import {
  isDepositTransaction,
  isLastLookOrderTransaction,
  isSubmittedOrder,
  isWithdrawTransaction,
} from "../../../entities/SubmittedTransaction/SubmittedTransactionHelpers";
import { compareAddresses } from "../../../helpers/string";
import i18n from "../../../i18n/i18n";

const isSenderWalletAccount = (
  transaction: SubmittedTransaction,
  account: string
) => {
  if (isSubmittedOrder(transaction) && transaction.swap) {
    return compareAddresses(transaction.swap.senderWallet, account);
  }

  return false;
};

const getWalletTransactionOrderText = (
  transaction: SubmittedTransaction,
  signerToken: TokenInfo,
  senderToken: TokenInfo,
  account: string,
  protocolFee: number
): string => {
  if (
    !(
      isSubmittedOrder(transaction) ||
      isWithdrawTransaction(transaction) ||
      isDepositTransaction(transaction)
    )
  ) {
    return "";
  }

  const orderOrSwap =
    isSubmittedOrder(transaction) && transaction.swap
      ? transaction.swap
      : transaction.order;

  let signerAmountWithFee: string | undefined = undefined;

  if (isLastLookOrderTransaction(transaction)) {
    signerAmountWithFee = new BigNumber(orderOrSwap.signerAmount)
      .multipliedBy(1 + protocolFee / 10000)
      .integerValue(BigNumber.ROUND_FLOOR)
      .toString();
  }

  const translation =
    isSubmittedOrder(transaction) && transaction.isLastLook
      ? "wallet.lastLookTransaction"
      : "wallet.transaction";

  const signerAmount = parseFloat(
    Number(
      formatUnits(
        signerAmountWithFee || orderOrSwap.signerAmount,
        signerToken.decimals
      )
    ).toFixed(5)
  );

  const senderAmount = parseFloat(
    Number(formatUnits(orderOrSwap.senderAmount, senderToken.decimals)).toFixed(
      5
    )
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

export default getWalletTransactionOrderText;
