import { BigNumber } from "bignumber.js";

// This helper function is used to round the number string to the nearest possible decimal allowed.
// To prevent the NUMERIC_FAULT error from bignumber.js when creating or approving orders.

const toRoundedNumberString = (value: string, decimals = 18): string => {
  return new BigNumber(value)
    .multipliedBy(10 ** decimals)
    .decimalPlaces(0, BigNumber.ROUND_UP)
    .dividedBy(10 ** decimals)
    .toString();
};

export default toRoundedNumberString;
