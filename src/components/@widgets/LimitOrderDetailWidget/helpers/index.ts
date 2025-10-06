import BigNumber from "bignumber.js";

import { DelegateRule } from "../../../../entities/DelegateRule/DelegateRule";
import toMaxAllowedDecimalsNumberString from "../../../../helpers/toMaxAllowedDecimalsNumberString";

export const getDelegateRuleTokensExchangeRate = (
  delegateRule: DelegateRule,
  senderTokenDecimals?: number,
  signerTokenDecimals?: number
): BigNumber => {
  if (!senderTokenDecimals || !signerTokenDecimals) {
    return new BigNumber(1);
  }

  const signerAmount = new BigNumber(delegateRule.signerAmount).dividedBy(
    10 ** signerTokenDecimals
  );
  const senderAmount = new BigNumber(delegateRule.senderAmount).dividedBy(
    10 ** senderTokenDecimals
  );

  return signerAmount.dividedBy(senderAmount);
};

/**
 * This function will calculate the senderAmount based on the signerAmount filled in by the user.
 * This is calculated based on the exchangeRate and what remains to be filled.
 * There's also checked if the amounts don't exceed the max allowed decimals.
 */

export const getCustomSenderAmount = (
  exchangeRate: BigNumber,
  signerAmount: string,
  availableSignerAmount: string,
  signerTokenDecimals = 18,
  senderTokenDecimals = 18
): { signerAmount: string; senderAmount: string } => {
  const justifiedSignerAmount = new BigNumber(signerAmount).isGreaterThan(
    availableSignerAmount
  )
    ? availableSignerAmount
    : signerAmount;

  const roundedSignerAmount = toMaxAllowedDecimalsNumberString(
    justifiedSignerAmount,
    signerTokenDecimals
  );

  const senderAmount = new BigNumber(roundedSignerAmount)
    .dividedBy(exchangeRate)
    .toString();

  return {
    signerAmount: roundedSignerAmount,
    senderAmount: toMaxAllowedDecimalsNumberString(
      senderAmount,
      senderTokenDecimals
    ),
  };
};

/**
 * This function will calculate the signerAmount based on the senderAmount filled in by the user.
 * This is calculated based on the exchangeRate and what remains to be filled.
 * There's also checked if the amounts don't exceed the max allowed decimals.
 */

export const getCustomSignerAmount = (
  exchangeRate: BigNumber,
  senderAmount: string,
  availableSenderAmount: string,
  senderTokenDecimals = 18,
  signerTokenDecimals = 18
): { signerAmount: string; senderAmount: string } => {
  const justifiedSenderAmount = new BigNumber(senderAmount).isGreaterThan(
    availableSenderAmount
  )
    ? availableSenderAmount
    : senderAmount;

  const roundedSenderAmount = toMaxAllowedDecimalsNumberString(
    justifiedSenderAmount,
    senderTokenDecimals
  );

  const signerAmount = new BigNumber(roundedSenderAmount)
    .multipliedBy(exchangeRate)
    .toString();

  return {
    signerAmount: toMaxAllowedDecimalsNumberString(
      signerAmount,
      signerTokenDecimals
    ),
    senderAmount: roundedSenderAmount,
  };
};
