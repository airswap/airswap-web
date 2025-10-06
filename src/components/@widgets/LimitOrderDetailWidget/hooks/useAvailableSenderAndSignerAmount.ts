import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";

import { DelegateRule } from "../../../../entities/DelegateRule/DelegateRule";

/**
 * This hook is used to get the available sender and signer amount for a limit order.
 * This is calculated based on the senderFilledAmount and what remains to be filled.
 */

export const useAvailableSenderAndSignerAmount = (
  delegateRule: DelegateRule,
  senderTokenDecimals?: number,
  signerTokenDecimals?: number
): { availableSenderAmount?: string; availableSignerAmount?: string } => {
  if (!senderTokenDecimals || !signerTokenDecimals) {
    return {
      availableSenderAmount: undefined,
      availableSignerAmount: undefined,
    };
  }

  const availableSenderAmount = new BigNumber(delegateRule.senderAmount).minus(
    delegateRule.senderFilledAmount
  );
  const availableRatio = new BigNumber(delegateRule.senderAmount).dividedBy(
    availableSenderAmount
  );

  const formattedAvailableSenderAmount = availableSenderAmount
    .dividedBy(10 ** senderTokenDecimals)
    .toString();

  const formattedAvailableSignerAmount = new BigNumber(
    delegateRule.signerAmount
  )
    .dividedBy(availableRatio)
    .integerValue(BigNumber.ROUND_CEIL)
    .dividedBy(10 ** signerTokenDecimals)
    .toString();

  if (!formattedAvailableSenderAmount || !formattedAvailableSignerAmount) {
    return {
      availableSenderAmount: undefined,
      availableSignerAmount: undefined,
    };
  }

  return {
    availableSenderAmount: formattedAvailableSenderAmount,
    availableSignerAmount: formattedAvailableSignerAmount,
  };
};
