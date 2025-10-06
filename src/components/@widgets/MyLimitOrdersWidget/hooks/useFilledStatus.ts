import { BigNumber } from "bignumber.js";

import { DelegateRule } from "../../../../entities/DelegateRule/DelegateRule";
import useFormattedTokenAmount from "../../OrderDetailWidget/hooks/useFormattedTokenAmount";

export const useFilledStatus = (
  delegateRule: DelegateRule,
  decimals?: number
): [string | undefined, number] => {
  const filledAmount = useFormattedTokenAmount(
    delegateRule.senderFilledAmount,
    decimals
  );
  const filledPercentage = new BigNumber(delegateRule.senderFilledAmount)
    .dividedBy(delegateRule.senderAmount)
    .multipliedBy(100)
    .toNumber();

  return [filledAmount, filledPercentage];
};
