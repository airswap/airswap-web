import { toAtomicString } from "@airswap/utils";

import { BigNumber } from "bignumber.js";

// This helper function is used to round the atomic string to the nearest possible decimal allowed.
// To prevent the NUMERIC_FAULT error from bignumber.js

const toRoundedAtomicString = (value: string, decimals = 18): string => {
  const roundedNumber = new BigNumber(value)
    .multipliedBy(10 ** decimals)
    .decimalPlaces(0, BigNumber.ROUND_UP)
    .dividedBy(10 ** decimals)
    .toString();

  return toAtomicString(roundedNumber, decimals);
};

export default toRoundedAtomicString;
