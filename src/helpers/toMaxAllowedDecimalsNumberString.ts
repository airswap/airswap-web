import { BigNumber } from "bignumber.js";

// This helper function is used to round the number string to the nearest possible decimal allowed.
// To prevent the NUMERIC_FAULT error from bignumber.js when creating orders or approving spend amounts.

const toMaxAllowedDecimalsNumberString = (
  value: string,
  decimals = 18
): string => {
  const firstCharacter = value[0];
  const lastCharacter = value[value.length - 1];
  const firstCharacterIsNonZero = !(
    firstCharacter === "0" || firstCharacter === "."
  );
  const firstCharacterIsPeriod = firstCharacter === ".";

  if (firstCharacterIsNonZero) {
    return value;
  }

  if (
    value === "" ||
    value === "." ||
    lastCharacter === "." ||
    lastCharacter === "0" ||
    (firstCharacter === "." && value.length - 1 <= decimals) ||
    (firstCharacter === "0" && value.length <= decimals)
  ) {
    return value;
  }

  const bigNumber = new BigNumber(value).multipliedBy(10 ** decimals);

  const [numberStringWithoutDecimals] = bigNumber.toString().split(".");

  const number = new BigNumber(numberStringWithoutDecimals)
    .dividedBy(10 ** decimals)
    .toString();

  if (new BigNumber(number).toNumber() === 0) {
    const minimalAllowedValue = new BigNumber(1)
      .dividedBy(10 ** decimals)
      .toString();

    return firstCharacterIsPeriod
      ? minimalAllowedValue.substring(1)
      : minimalAllowedValue;
  }

  return firstCharacterIsPeriod ? number.substring(1) : number;
};

export default toMaxAllowedDecimalsNumberString;
