export const stringToSignificantDecimals: (
  input: string,
  sigDecimals?: number,
  length?: number
) => string = (input, sigDecimals = 6, length = 9) => {
  // Custom: added single decimal to whole numbers and handle large edge case
  if (input.indexOf(".") === -1 && input.length > length) {
    return `> ${"9".repeat(length)}.9`;
  } else if (input.indexOf(".") === -1) {
    return `${input}`;
  }

  const [beforeDecimalPoint, afterDecimalPoint] = input.split(".");
  let trimmedDecimals = "";

  // Custom: handles integers longer than length
  if (beforeDecimalPoint.length > length) {
    return `> ${"9".repeat(length)}.9`;
  }

  if (beforeDecimalPoint.match(/[1-9]/)) {
    // Custom: trims to sigDecimals, not 4
    trimmedDecimals = afterDecimalPoint.slice(0, sigDecimals);
    if (/^0*$/.test(trimmedDecimals)) {
      return `${beforeDecimalPoint}`;
    }
  } else if (afterDecimalPoint.length <= sigDecimals) {
    trimmedDecimals = afterDecimalPoint;
  } else {
    let sigDecimalsRemaining = sigDecimals;
    let i = 0;
    let inLeadingZeroes = true;
    // Custom: afterDecimalPoint.length - 1 cut off string before sigDecimal
    while (sigDecimalsRemaining > 0 && i < afterDecimalPoint.length) {
      const currentDigit = afterDecimalPoint[i];
      trimmedDecimals += currentDigit;
      if (!inLeadingZeroes || currentDigit !== "0") {
        inLeadingZeroes = false;
        sigDecimalsRemaining--;
      }
      i++;
    }

    // Custom: handles decimals longer than length
    if (trimmedDecimals.length - sigDecimals >= length) {
      return `< 0.${"0".repeat(length - 1)}1`;
    }
  }

  return `${beforeDecimalPoint}.${trimmedDecimals}`;
};

export default stringToSignificantDecimals;
